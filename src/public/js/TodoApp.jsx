import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import SideBar from './Sidebar.jsx'
import TodoList from './TodoList.jsx'
import TodoEditor from './TodoEditor.jsx'
import api_request from './api.js'
import qs from 'query-string'
import {cloneDeep, each, set} from 'lodash'
const {assign} = Object

export default class TodoApp extends Component {
  constructor(props) {
    super(props)
    this.state = {todos: [],  lists: [], focused_todo: null, focused_list: null}
    this.create_todo = this.create_todo.bind(this)
    this.on_todo_update = this.on_todo_update.bind(this)
    this.on_list_update = this.on_list_update.bind(this)
    this.on_sort = this.on_sort.bind(this)
  }
  list (props) { return (props || this.props).match.params.list }
  async get_todos() {
    this.setState({todos_loading: true})
    try {
      let [todos, focused_list] = await Promise.all([
        await (await api_request(`/lists/${this.list()}/todos`)).json(),
        await (await api_request(`/lists/${this.list()}`)).json(),
      ])
      this.setState({
        todos,
        focused_list: this._normalize_list(focused_list),
        todos_loading: false,
      })
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
    let list = this.list()
    try {
      let res = await api_request(`/todos/${id}`, {method: 'PATCH', body: update})
      if (res.status !== 200) {
        throw new Error('Not updated correctly')
      }
      let todo = await res.json()
      // TODO josh: replace this with a proper reducer function
      this.setState(prev => {
        let focused = prev.focused_todo
        return assign({}, prev, {
          todos: prev.todos.map(_todo => _todo._id !== todo._id ? _todo : todo)
            .filter(todo => todo.list.includes(list)),
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
  async on_sort (todo, new_index) {
    try {
      let todos = this.state.todos
      todos = todos.map(t => t._id === todo._id ? null : t)
      todos = [
        ...todos.slice(0, new_index),
        assign({}, todo),
        ...todos.slice(new_index),
      ]
      let sort = todos.filter(Boolean).map(t => t._id)
      let list = await (await api_request(`/lists/${this.list()}`,
        {method: 'PATCH', body: {sort}})).json()
      this.setState({focused_list: this._normalize_list(list)})
      // TODO josh: notify an alert service instead of just logging to console
    } catch (e) {
      console.error(e)
    }
  }
  _normalize_list (data) {
    return assign({
      name: this.list(),
      sharing: {public: false, private: false},
    }, data || {})
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
  async on_list_update (id, update) {
    this.setState(prev => {
      let focused_list = cloneDeep(prev.focused_list)
      each(update, (v, k) => set(focused_list, k, v))
      let new_state = assign({}, prev, {focused_list})
      return new_state
    })
  }
  render() {
    let {lists, todos, todos_loading, focused_todo, focused_list} = this.state
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
            list={focused_list}
            loading={todos_loading}
            showDone={done}
            todos={done ? completed : in_progress}
            onTodoCreate={this.create_todo}
            onTodoUpdate={this.on_todo_update}
            onListUpdate={this.on_list_update}
            onSort={this.on_sort}/>
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
