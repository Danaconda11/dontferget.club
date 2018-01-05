const util = require('./util')
const lists = require('../lists')
const React = require('react')
const ReactDomServer = require('react-dom/server')
const ReadOnlyTodoList = require('../public/js/view/ReadOnlyTodoList.jsx').default
const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
const _ = require('lodash')

module.exports = util.http_handler(async (req, res) => {
  let unauthorized = () => res.status(401).end()
  // TODO josh: support JWT private list sharing tokens
  if (!UUID_REGEX.test(req.params.token)) {
    return unauthorized()
  }
  let list = await lists.find_by_uuid(req.params.token)
  if (!list || !_.get(list, 'sharing.public')) {
    return unauthorized()
  }
  res.send(ReactDomServer.renderToStaticMarkup(React.createElement(ReadOnlyTodoList,
    {list, todos: [], url: req.url})))
})
