import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import SideBar from './sidebar.jsx'
import TodoList from './todo-list.jsx'
import TodoEditor from './todo-editor.jsx'
import api_request from './api.js'
import qs from 'query-string';
const {assign} = Object

export default class TodoApp extends Component {
  constructor(props) {
    super(props)
    this.state = {todos: [],  lists: []}
    this.create_todo = this.create_todo.bind(this)
    this.on_todo_update = this.on_todo_update.bind(this)
  }
  list (props) { return (props || this.props).match.params.list }
  async get_todos() {
    try {
      let todos = await (await api_request(`/lists/${this.list()}/todos`)).json()
      this.setState({todos})
    } catch (e) {
      console.error(e)
    }
  }
  async get_lists() {
    try {
      let lists = await (await api_request(`/lists`)).json()
      this.setState({lists})
    } catch (e) {
      console.error(e)
    }
  }
  async on_todo_update (id, update) {
    try {
      let res = await api_request(`/todos/${id}`, {method: 'PATCH', body: update})
      if (res.status !== 200) {
        throw new Error('Not updated correctly')
      }
      let todo = await res.json()
      this.setState(prev => {
        return assign({}, prev, {
          todos: prev.todos.map(_todo => _todo._id !== todo._id ? _todo : todo),
        })
      })
      // TODO josh: notify an alert service instead of just logging to console
    } catch (e) {
      console.error(e)
    }
  }
  componentDidMount() {
    this.get_todos()
    this.get_lists()
  }
  componentDidUpdate(prev_props) {
    if (this.list(prev_props) !== this.list()) {
      this.get_todos()
    }
  }
  async create_todo(body) {
    try {
      let todo = await (await api_request('/todos', {method: 'POST', body})).json()
      this.setState(prev => {
        return assign({}, prev, {
          todos: [todo].concat(prev.todos),
        })
      })
    } catch (e) {
      console.error(e)
    }
  }
  render() {
    let {lists, todos} = this.state
    let [completed, in_progress] = _.partition(todos, todo => todo.completed)
    let {done} = qs.parse(this.props.location.search)
    return (
      <div className="row">
        <div className="col-sm-2">
          <SideBar
            current={this.props.match.params.list}
            lists={lists}/>
        </div>
        <div className="col-sm">
          <TodoList
            name={this.list()}
            showDone={done}
            todos={done ? completed : in_progress}
            onTodoCreate={this.create_todo}
            onTodoUpdate={this.on_todo_update}/>
        </div>
        <Route path="/list/:list/:todo" render={({match}) =>
          <div className="col-md-4">
            <TodoEditor todo={match.params.todo}
              onUpdate={this.on_todo_update}/>
          </div>}/>
      </div>
    )
  }
}
