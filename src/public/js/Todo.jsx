import React from 'react'
import {Link} from 'react-router-dom'
import {DragSource} from 'react-dnd'
import {isWebUri} from 'valid-url'
import {withRouter} from 'react-router-dom'
import _ from 'lodash'

function Todo ({isDragging, connectDragSource, todo, list, onUpdate, history}) {
  if (!todo) {
    return null
  }
  let lists = _.uniq((todo.list||[]))
  const navigate = e => {
    if (['INPUT', 'I', 'A'].includes(e.target.nodeName)) {
      return
    }
    history.push(`/list/${list}/${todo._id}`)
  }
  return connectDragSource(
    <li className={'todo_item' + (todo.completed ? ' completed' : '') +
      (isDragging ? ' dragging' : '')} onClick={navigate}>
      <i className="fa fa-bars drag_handle"/>
      <input type="checkbox" defaultChecked={todo.completed}
        onChange={e => onUpdate(todo._id, {completed: e.target.checked})} />
      {isWebUri(todo.title) ? <a href={todo.title}>{todo.title}</a> : todo.title}
      <div className="lists">
        {lists.map(l =>
          <Link key={l} to={`/list/${l}`}
            className="badge badge-secondary list_label">
            {l}
            <i className="fa fa-remove remove"
              onClick={e => {
                e.preventDefault()
                onUpdate(todo._id, {list: _.without(todo.list, l)})
              }}/>
          </Link>)}
      </div>
    </li>
  )
}

let spec = {
  beginDrag (props) { return props.todo },
}
let monitor = (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
})
// CONTINUE josh: allow drag and drop re-ordering of todo items
Todo = withRouter(DragSource('todo', spec, monitor)(Todo))

function FakeTodo ({text, list}) {
  return (
    <li className="todo_item fake">
      <i className="fa fa-bars drag_handle"/>
      <input type="checkbox" disabled={true}/>
      {text}
      <div className="lists">
        <span className="badge badge-secondary list_label">{list}</span>
      </div>
    </li>
  )
}

export {FakeTodo, Todo as default}
