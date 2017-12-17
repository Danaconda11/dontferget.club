import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Todo from './Todo.jsx'

export default class TodoList extends Component {
  constructor (props) {
    super(props)
    this.state = {new_todo: ''}
  }
  render () {
    let {new_todo} = this.state
    let {name, todos, onTodoCreate, onTodoUpdate, showDone} = this.props
    return (
      <div>
        <div className="d-flex">
          <h3>{name}</h3>
          <div className="ml-auto">
            <Link className={'btn btn-sm ' + (showDone ? 'btn-link' : 'btn-primary')}
              to={`/list/${name}`}>
              Doing
            </Link>
            <Link className={'btn btn-sm ' + (!showDone ? 'btn-link' : 'btn-primary')}
              to={`/list/${name}?done=true`}>
              Done
            </Link>
          </div>
        </div>
        <form onSubmit={e => {
          e.preventDefault()
            let todo = {title: new_todo, completed: false}
          if (name && name !== 'all') {
            todo.list = [name]
          }
          this.setState({new_todo: ''})
          onTodoCreate(todo)
        }} className="new_todo d-flex">
          <div className="input-group">
            <input placeholder="Buy milk..." value={new_todo}
              onChange={e => this.setState({new_todo: e.target.value})}
              className="form-control" autoFocus={true} />
            <div className="input-group-btn">
              <button className="btn btn-outline-success" disabled={!new_todo}>
                <i className="fa fa-plus"/>
              </button>
            </div>
          </div>
        </form>
        <ul className="todo_items">
          {todos.map(todo =>
            <Todo
              key={todo._id}
              onUpdate={onTodoUpdate}
              todo={todo}
              list={name}/>)}
        </ul>
      </div>
    )
  }
}
