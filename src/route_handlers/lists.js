const mongo = require('../mongo')
const users = require('../users')
const Wunderlist = require('wunderlist')
const config = require('../config')
const _ = require('lodash')
const util = require('./util')
let E = module.exports

// wunderlist api "promises" don't behave like real promises should
let real_promise = maybe_promise => {
  return new Promise((resolve, reject) => {
    maybe_promise.done(data => {
      resolve(data)
    }).fail(err => {
      reject(err)
    })
  })
}

let promise_map = (array, fn) => {
  let results = []
  return array.reduce((prev, item, i) => {
    return prev.then(res => {
      if (i) {-
        results.push(res)
      }
      return fn(item)
    })
  }, Promise.resolve())
  .then(() => {
    return results
  })
}

// TODO josh: move to src/import/wunderlist.js
let sync_wunderlist = user => mongo.connect().then(db => {
  let api = new Wunderlist({
    accessToken: _.get(user, 'external.wunderlist.access_token'),
    clientID: config.wunderlist.client_id,
  })
  return real_promise(api.http.lists.all()).then(lists => {
    return promise_map(lists, list => {
      return sync_list(api, user, list)
    })
  }).then(lists => {
    return lists.reduce((state, i) => {
      state.items += i.items.length
      return state
    }, {lists: lists.length, items: 0})
  })
})

let sync_list = (api, user, list) => {
  return real_promise(api.http.tasks.forList(list.id)).then(tasks => {
    let db
    let todos
    let lists
    return mongo.connect().then(_db => {
      db = _db
      todos = _db.collection('todos')
      lists = _db.collection('lists')
      return lists.update(
        {wunderlist_id: list.id},
        {$set: {title: list.title, wunderlist_id: list.id}},
        {upsert: true})
    }).then(res => {
      return lists.findOne({wunderlist_id: list.id}, {_id: 1})
    }).then(list => {
      return promise_map(tasks, t => {
        return todos.update(
          {wunderlist_id: t.id},
          {$set: {title: t.title, completed: t.completed, starred: t.starred,
            wunderlist_id: t.id, list: list._id}},
          {upsert: true})
      })
    }).then(updates => {
      return {items: updates}
    })
  })
}

E.import = (req, res, next) => mongo.connect().then(db => {
  return users.find_one({username: req.user.username}).then(user => {
    let token = _.get(user, 'external.wunderlist.access_token')
    if (!token) {
      return res.status(401).json({
        error: 'Not authenticated with wunderlist',
      })
    }
    return sync_wunderlist(user).then(sync => {
      res.status(201).json({sync})
    }).catch(err => {
      console.error(err)
      res.status(500).json({
        error: err.message,
        stack: err.stack,
      })
    })
  })
})

// TODO josh: merge in metadata info from 'lists' collection
// TODO josh: extract mongo interaction into src/list.js
E.get_all = util.http_handler(async (req, res, next) => {
  let db = await mongo.connect()
  let lists = await db.collection('todos').distinct('list',
    {user_id: req.user._id})
  lists.unshift('Inbox')
  lists.push('All')
  res.json(_.uniq(lists))
})

// TODO josh: extract mongo interaction into src/list.js
E.get = util.http_handler(async (req, res, next) => {
  let db = await mongo.connect()
  res.json(await db.collection('lists').findOne({
    list_id: req.params.list,
    user_id: req.user._id,
  }))
})

// TODO josh: extract mongo interaction into src/list.js
E.update = util.http_handler(async (req, res, next) => {
  let db = await mongo.connect()
  let update = _(req.body).toPairs()
  .filter(([k]) => ['sort'].includes(k))
  .fromPairs()
  .value()
  if (_.isEmpty(update)) {
    return res.status(400).json({ error: 'Invalid update' })
  }
  await db.collection('lists').update({
    list_id: req.params.list,
    user_id: req.user._id,
  }, {$set: update}, {upsert: true})
  res.json(await db.collection('lists').findOne({
    list_id: req.params.list,
    user_id: req.user._id,
  }))
})
