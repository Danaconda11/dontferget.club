import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import SideBar from './Sidebar.jsx'
import TodoList from './TodoList.jsx'
import TodoEditor from './TodoEditor.jsx'
import api_request from './api.js'
import qs from 'query-string'
const {assign} = Object

export default class TodoApp extends Component {
  constructor(props) {
    super(props)
    this.state = {todos: [],  lists: [], focused_todo: null}
    this.create_todo = this.create_todo.bind(this)
    this.on_todo_update = this.on_todo_update.bind(this)
  }
  list (props) { return (props || this.props).match.params.list }
  async get_todos() {
    this.setState({todos_loading: true})
    try {
      let todos = await (await api_request(`/lists/${this.list()}/todos`)).json()
      this.setState({todos, todos_loading: false})
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
  async load_focused_todo (id) {
    try {
      let todo = await (await api_request(`/todos/${id}`)).json()
      this.setState({focused_todo: todo})
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
        let focused = prev.focused_todo
        return assign({}, prev, {
          todos: prev.todos.map(_todo => _todo._id !== todo._id ? _todo : todo),
          focused_todo: focused && focused._id === todo._id ? todo : focused,
        })
      })
      // TODO josh: notify an alert service instead of just logging to console
    } catch (e) {
      console.error(e)
    }
  }
  async on_new_list (list) {
    this.setState(prev => {
      return assign({}, prev, {todos: []})
    })
  }
  componentDidMount() {
    this.get_todos()
    this.get_lists()
    let focused = this.props.match.params.todo
    if (focused) {
      this.load_focused_todo(focused)
    }
  }
  componentDidUpdate(prev) {
    let focused = this.props.match.params.todo
    if (focused !== prev.match.params.todo) {
      this.load_focused_todo(focused)
    }
    if (this.list(prev) !== this.list()) {
      this.get_todos()
    }
  }
  async create_todo(body) {
    try {
      let todo = await (await api_request('/todos', {method: 'POST', body})).json()
      this.setState(prev => {
        return assign({}, prev, {
          todos: [todo].concat(prev.todos),
          lists: _.uniq(prev.lists.concat(todo.list).filter(Boolean)),
        })
      })
    } catch (e) {
      console.error(e)
    }
  }
  render() {
    let {lists, todos, todos_loading, focused_todo} = this.state
    let [completed, in_progress] = _.partition(todos, todo => todo.completed)
    let {done} = qs.parse(this.props.location.search)
    return (
      <div className="row">
        <div className="col-sm-2">
          <SideBar
            current={this.props.match.params.list}
            lists={lists}
            onNewList={list => this.on_new_list(list)}/>
        </div>
        <div className="col-sm">
          <TodoList
            name={this.list()}
            loading={todos_loading}
            showDone={done}
            todos={done ? completed : in_progress}
            onTodoCreate={this.create_todo}
            onTodoUpdate={this.on_todo_update}/>
        </div>
        <Route path="/list/:list/:todo" render={() =>
          <div className="col-md-4">
            {focused_todo ? <TodoEditor todo={focused_todo}
              onUpdate={this.on_todo_update}/> : <p>Loading...</p>}
          </div>}/>
      </div>
    )
  }
}
