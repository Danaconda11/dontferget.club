const _ = require('lodash')
const todos = require('../todos')
const util = require('./util.js')
E = module.exports

E.add = util.try_catch(async (req, res, next) => {
  let todo = req.body
  todo.user_id = req.user._id
  let insert = await todos.insert(todo)
  let new_todo = await todos.find_by_id(insert.insertedIds[0])
  return res.status(201).json(todo)
})

E.get_all = util.try_catch(async (req, res, next) => {
  let items = await todos.find_all({ user_id: req.user._id })
  return res.json(items)
})

E.update = (req, res, next) => {
  let update = req.body
  let id = req.params.id
  if (!id || _.isEmpty(update)) {
    return res.status(400).json({ error: 'Invalid update' })
  }
  return todos.update(id, update).then(result => {
    return todos.find_by_id(id)
  }).then(todo => {
    res.json(todo)
  }).catch(err => {
    next(err)
  })
}

E.remove = (req, res, next) => {
  return todos.remove(req.params.id).then(result => {
    res.json(result)
  }).catch(err => {
    next(err)
  })
}
