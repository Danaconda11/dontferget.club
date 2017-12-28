import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Todo, {FakeTodo} from './Todo.jsx'

export default class TodoList extends Component {
  constructor (props) {
    super(props)
    this.state = {new_todo: '', hover_index: null}
    this.on_drop_hover = this.on_drop_hover.bind(this)
    this.on_drop = this.on_drop.bind(this)
  }
  on_drop_hover (index) { this.setState({hover_index: index}) }
  on_drop (...args) {
    this.setState({hover_index: null})
    this.props.onSort(...args)
  }
  render () {
    let {new_todo, hover_index} = this.state
    let {name, todos, loading, onTodoCreate, onTodoUpdate, showDone} = this.props
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
          {loading ?
            <div>
              <FakeTodo text="Milk" list={name}/>
              <FakeTodo text="Bread" list={name}/>
              <FakeTodo text="Cheese" list={name}/>
            </div> :
            todos.map((todo, i) =>
              <Todo
                key={todo._id}
                index={i}
                onUpdate={onTodoUpdate}
                hoverIndex={hover_index}
                onDropHover={this.on_drop_hover}
                onSort={this.on_drop}
                todo={todo}
                list={name}/>)}
        </ul>
      </div>
    )
  }
}
