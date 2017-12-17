import React from 'react'
import {Link} from 'react-router-dom'
import {DragSource} from 'react-dnd'

function ListItem ({isDragging, connectDragSource, todo, list, onUpdate}) {
  if (!todo) {
    return null
  }
  let lists = _.uniq((todo.list||[]))
  return connectDragSource(
    <li className={'todo_item' + (todo.completed ? ' completed' : '') +
      (isDragging ? ' dragging' : '')}>
      <i className="fa fa-bars drag_handle"/>
      <input type="checkbox" defaultChecked={todo.completed}
        onChange={e => onUpdate(todo._id, {completed: e.target.checked})} />
      <Link to={`/list/${list}/${todo._id}`} className="title">
        {todo.title}</Link>
      <div className="lists">
        {lists.map(l =>
          <Link key={l} to={`/list/${l}`}
            className="badge badge-secondary list_link">{l}</Link>)}
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
export default DragSource('todo', spec, monitor)(ListItem)
