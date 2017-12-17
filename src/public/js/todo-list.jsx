import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Todo from './todo.jsx'

export default function TodoList ({name, todos, onTodoCreate, onTodoUpdate,
  showDone})
{
  let new_todo
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
          let todo = {title: new_todo.value, completed: false}
        if (name && name !== 'all') {
          todo.list = [name]
        }
        new_todo.value = ''
        onTodoCreate(todo)
      }} className="new_todo d-flex">
        <div className="input-group">
          <input ref={node => new_todo = node} placeholder="Buy milk..."
            className="form-control" autoFocus={true} />
          <div className="input-group-btn">
            <button className="btn btn-outline-success">
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
