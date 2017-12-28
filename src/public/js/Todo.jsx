import React from 'react'
import {findDOMNode} from 'react-dom'
import {Link} from 'react-router-dom'
import {DragSource, DropTarget} from 'react-dnd'
import {isWebUri} from 'valid-url'
import {withRouter} from 'react-router-dom'
import _ from 'lodash'

function Todo ({isDragging, connectDragSource, connectDropTarget, todo, list,
  onUpdate, history, hoverIndex, index})
{
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
  return connectDragSource(connectDropTarget(
    // TODO josh: investigate react class generation shorthands
    <li className={'todo_item' + (todo.completed ? ' completed' : '') +
      (isDragging ? ' dragging' : '') +
      (hoverIndex === index+1 ? ' drop_hover_bottom' : '') +
      (hoverIndex === 0 && index === 0 ? ' drop_hover_top' : '')} onClick={navigate}>
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
  ))
}

let source_actions = {
  beginDrag (props) { return {todo: props.todo, index: props.index} },
}
let target_actions = {
  hover ({index, onDropHover}, monitor, component) {
    let {x, y} = monitor.getClientOffset()
    let {height: el_height, y: el_y} =
      findDOMNode(component).getBoundingClientRect()
    let midpoint = el_y+(el_height/2)
    onDropHover(y>=midpoint ? index+1 : index)
  },
  drop ({index, onSort}, monitor, component) {
    let {todo} = monitor.getItem()
    let {x, y} = monitor.getClientOffset()
    let {height: el_height, y: el_y} =
      findDOMNode(component).getBoundingClientRect()
    let midpoint = el_y+(el_height/2)
    onSort(todo, y>=midpoint ? index+1 : index)
  },
}
Todo = _.flow([
  DragSource('todo', source_actions, (connect, monitor) => ({
  	connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })),
  DropTarget('todo', target_actions, connect => ({
  	connectDropTarget: connect.dropTarget(),
  })),
  withRouter,
])(Todo)

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
