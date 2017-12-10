import React, { Component } from 'react'
import ListItem from './list-item.jsx'
import api_request from './api.js'
import * as qs from 'query-string';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { todos: [] }
    this.done = this.props.location.query    
    this.get_todos = this.get_todos.bind(this)
    this.on_change = this.on_change.bind(this)
    this.on_submit = this.on_submit.bind(this)
    this.todo_modified = this.todo_modified.bind(this)
    console.log(this.props)
  }
  get_todos() {
    api_request('/todos')
      .then(res => {
        return res.json()
      }).then(todos => {
        this.setState({ todos: todos })
      }).catch(err => {
        console.error(err)
      })
  }
  componentDidMount() {
    this.get_todos()
  }
  todo_modified(updated) {
    let todos = this.state.todos.map(todo => {
      return todo._id === updated._id ? updated : todo
    })
    this.setState({ todos })
  }
  on_change(event) {
    this.setState({ value: event.target.value })
  }
  on_submit(event) {
    event.preventDefault()
    this.refs.todo_input.value = ''
    api_request('/todos', {
      method: 'POST',
      body: { title: this.state.value, completed: false },
    }).then(() => {
      this.get_todos()
    }).catch(err => {
      console.error(err)
    })
  }
  render() {
    let [completed, in_progress] = _.partition(this.state.todos, todo => todo.completed)
    let {done} = qs.parse(this.props.location.search)
    
    return (
      <div>
        <form onSubmit={this.on_submit} className="new_todo">
          <input ref='todo_input' placeholder='Add a todo'
            onChange={this.on_change} autoFocus={true} />
          <button className="primary">&#43;</button>
        </form>

        {!done && <ul className="todo_items">
          {in_progress.map(todo =>
            <ListItem
              modified={this.todo_modified}
              key={todo._id}
              disabled={todo.completed}
              todo={todo} />)}
        </ul>}

        { done && <ul className="todo_items completed_todos">
          {completed.map(todo =>
            <ListItem
              modified={this.todo_modified}
              key={todo._id}
              disabled={todo.completed}
              todo={todo} />)}
        </ul>}
      </div>
    )
  }
}
