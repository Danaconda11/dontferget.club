import React, {Component} from 'react'
import {NavLink, Link} from 'react-router-dom'
import {DropTarget} from 'react-dnd'
import api from './api.js'
import _ from 'lodash'
import { CSSTransitionGroup } from 'react-transition-group'

const render_nav_link = ({canDrop, isOver, connectDropTarget, list, active}) => connectDropTarget(
  <div>
    <Link to={`/list/${list}`}
      className={'list' + (canDrop ? ' droppable' : '') +
        (isOver ? ' drop_hover' : '') + (active ? ' active' : '')}>
      {list}
      <i className={'ml-auto as-center fa fa-bullseye '}/>
    </Link>
  </div>
)

const render_clear = ({canDrop, isOver, connectDropTarget, list, active}) => connectDropTarget(
  <div>
    {canDrop &&
      <CSSTransitionGroup
        transitionName="fade"
        transitionAppear={true}
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        <div
          className={'clear_button btn btn-sm btn-danger'
            + (canDrop ? ' droppable' : '')
            + (isOver ? ' drop_hover ' : '')
            + (active ? ' active ' : '')}> Clear Labels <i className={"ml-auto as-center fa fa-bullseye"}/>
        </div>
      </CSSTransitionGroup>}
  </div>
)

const SidebarList = DropTarget('todo', {
  drop (props, monitor) {
    let todo = monitor.getItem()
    todo.list = _.uniq((todo.list || []).concat([props.list]))
    api(`/todos/${todo._id}`, {method: 'PATCH', body: todo})
    // TODO josh: handle update responses
  },
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(render_nav_link)

const ClearButton = DropTarget('todo', {
  drop (props, monitor) {
    let todo = monitor.getItem()
    todo.list = []
    api(`/todos/${todo._id}`, {method: 'PATCH', body: todo})
  },
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(render_clear)

export default class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.state = {new_list: ''}
  }
  on_change (e) {
    let {target} = e
    this.setState({[target.name]: target.value})
  }
  render() {
    let {lists, current} = this.props
    let {new_list} = this.state
    lists = lists.slice().sort((a, b) => {
      if (a === 'Inbox') {
        return -1
      }
      if (b === 'Inbox') {
        return 1
      }
      if (a === 'All') {
        return -1
      }
      if (b === 'All') {
        return 1
      }
      return 0
    })
    return (
      <div className="sidebar">
        {lists.map(list =>
          <SidebarList key={list} list={list} active={list === current}/>
        )}
          <ClearButton/>
        <div className="input-group">
          <input name="new_list" className="form-control form-control-sm"
            value={new_list} onChange={e=>this.on_change(e)}
            placeholder="New list"/>
          {new_list &&
            <div className="input-group-btn">
              <Link to={`/list/${new_list}`} className="btn btn-sm btn-primary"
                onClick={() => this.setState({new_list: ''})}>
                <i className="fa fa-plus"/>
              </Link>
            </div>}
        </div>
      </div>
    )
  }
}
