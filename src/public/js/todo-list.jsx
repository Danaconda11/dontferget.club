import React, {Component} from 'react'
import {Route, Link} from 'react-router-dom'
import SideBar from './sidebar.jsx'
import ListItem from './list-item.jsx'
import TodoEditor from './todo-editor.jsx'
import api_request from './api.js'
import qs from 'query-string';

export default class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = {todos: []}
    this.done = props.location.query
    this.get_todos = this.get_todos.bind(this)
    this.on_submit = this.on_submit.bind(this)
    this.todo_modified = this.todo_modified.bind(this)
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
  componentDidMount() { this.get_todos() }
  componentDidUpdate(prev_props) {
    if (this.list(prev_props) !== this.list()) {
      this.get_todos()
    }
  }
  todo_modified(updated) {
    let todos = this.state.todos.map(todo => {
      return todo._id === updated._id ? updated : todo
    })
    this.setState({ todos })
  }
  on_change(event) {
    this.setState({value: event.target.value})
  }
  async on_submit(event) {
    try {
      event.preventDefault()
      this.refs.todo_input.value = ''
      let todo = {title: this.state.value, completed: false}
      if (this.list() && this.list() !== 'all') {
        todo.list = [this.list()]
      }
      await api_request('/todos', {method: 'POST', body: todo})
      await this.get_todos()
    } catch (e) {
      console.error(err)
    }
  }
  render() {
    let [completed, in_progress] = _.partition(this.state.todos, todo => todo.completed)
    let {done} = qs.parse(this.props.location.search)
    return (
      <div className="row">
        <div className="col-sm-2">
          <SideBar/>
        </div>
        <div className="col-sm">
          <div className="d-flex">
            <h3>{this.list()}</h3>
            <div className="ml-auto">
              <Link className={done ? 'btn btn-link' : 'btn btn-primary'} to={`/list/${this.list()}`}>Doing</Link>
              <Link className={!done ? 'btn btn-link' : 'btn btn-primary'}  to={`/list/${this.list()}?done=true`}>Done</Link>
            </div>     
          </div>
          <form onSubmit={this.on_submit} className="new_todo d-flex">
            <div className="input-group">
              <input ref="todo_input" placeholder="Buy milk..."
                className="form-control" onChange={e => this.on_change(e)}
                autoFocus={true} />
              <div className="input-group-btn">
                <button className="btn btn-primary">
                  <i className="fa fa-plus"/>
                </button>
              </div>
            </div>
          </form>
          {!done && <ul className="todo_items">
            {in_progress.map(todo =>
              <ListItem
                modified={this.todo_modified}
                key={todo._id}
                disabled={todo.completed}
                todo={todo}
                list={this.list()}/>)}
          </ul>}
          {done && <ul className="todo_items completed_todos">
            {completed.map(todo =>
              <ListItem
                modified={this.todo_modified}
                key={todo._id}
                disabled={todo.completed}
                todo={todo}
                list={this.list()}/>)}
          </ul>}
        </div>
        <Route path="/list/:list/:todo" render={({match}) =>
          <div className="col-md-4">
            <TodoEditor todo={match.params.todo} />
          </div>}/>
      </div>
    )
  }
}
