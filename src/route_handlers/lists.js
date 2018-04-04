const mongo = require('../mongo')
const users = require('../users')
const Wunderlist = require('wunderlist')
const config = require('../config')
const _ = require('lodash')
const util = require('./util')
const lists = require('../lists')
let E = module.exports

// wunderlist api "promises" don't behave like real promises should
let real_promise = maybe_promise => {
  return new Promise((resolve, reject) => {
    maybe_promise
      .done(data => {
        resolve(data)
      })
      .fail(err => {
        reject(err)
      })
  })
}

let promise_map = (array, fn) => {
  let results = []
  return array
    .reduce((prev, item, i) => {
      return prev.then(res => {
        if (i) {
          ;-results.push(res)
        }
        return fn(item)
      })
    }, Promise.resolve())
    .then(() => {
      return results
    })
}

// TODO josh: move to src/import/wunderlist.js
let sync_wunderlist = async user => {
  let db = await mongo.connect()
  let api = new Wunderlist({
    accessToken: _.get(user, 'external.wunderlist.access_token'),
    clientID: config.wunderlist.client_id,
  })
  // TODO josh: flatten
  return real_promise(api.http.lists.all())
    .then(lists => {
      return promise_map(lists, list => {
        return sync_list(api, user, list)
      })
    })
    .then(lists => {
      return lists.reduce(
        (state, i) => {
          state.items += i.items.length
          return state
        },
        {lists: lists.length, items: 0},
      )
    })
}

let sync_list = (api, user, list) => {
  return real_promise(api.http.tasks.forList(list.id)).then(tasks => {
    let db
    let todos
    let lists
    return mongo
      .connect()
      .then(_db => {
        db = _db
        todos = _db.collection('todos')
        lists = _db.collection('lists')
        return lists.update(
          {wunderlist_id: list.id},
          {$set: {title: list.title, wunderlist_id: list.id}},
          {upsert: true},
        )
      })
      .then(res => {
        return lists.findOne({wunderlist_id: list.id}, {_id: 1})
      })
      .then(list => {
        return promise_map(tasks, t => {
          return todos.update(
            {wunderlist_id: t.id},
            {
              $set: {
                title: t.title,
                completed: t.completed,
                starred: t.starred,
                wunderlist_id: t.id,
                list: list._id,
              },
            },
            {upsert: true},
          )
        })
      })
      .then(updates => {
        return {items: updates}
      })
  })
}

E.add = util.http_handler(async (req, res) => {
  let errors = lists.validate(req.body)
  if (errors) {
    return res.status(400).json({message: "Couldn't create list", errors})
  }
  let list = Object.assign(req.body, {user_id: req.user._id})
  res.status(201).json(await lists.create(list))
})

E.import = async (req, res, next) => {
  let db = await mongo.connect()
  return await users.find_one({username: req.user.username}).then(user => {
    let token = _.get(user, 'external.wunderlist.access_token')
    if (!token) {
      return res.status(401).json({
        error: 'Not authenticated with wunderlist',
      })
    }
    return sync_wunderlist(user)
      .then(sync => {
        res.status(201).json({sync})
      })
      .catch(err => {
        console.error(err)
        res.status(500).json({
          error: err.message,
          stack: err.stack,
        })
      })
  })
}

E.get_all = util.http_handler(async (req, res, next) => {
  res.json(await lists.find_all({user_id: req.user._id}))
})

E.get = util.http_handler(async (req, res, next) => {
  res.json(await lists.find_by_name(req.user._id, req.params.list))
})

// TODO josh: extract mongo interaction into src/list.js
E.update = util.http_handler(async (req, res, next) => {
  let db = await mongo.connect()
  let update = _(req.body)
    .toPairs()
    .filter(([k]) => ['sort', 'sharing.public', 'sharing.private'].includes(k))
    .fromPairs()
    .value()
  if (_.isEmpty(update)) {
    return res.status(400).json({error: 'Invalid update'})
  }
  await db.collection('lists').update(
    {
      user_id: req.user._id,
      name: req.params.list,
    },
    {$set: update},
  )
  res.json(await lists.find_by_name(req.user._id, req.params.list))
})
