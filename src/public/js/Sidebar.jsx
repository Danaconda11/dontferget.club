import React, {Component} from 'react'
import {NavLink, Link} from 'react-router-dom'
import {DropTarget} from 'react-dnd'
import api from './api.js'
import _ from 'lodash'
import { CSSTransitionGroup } from 'react-transition-group'

const render_nav_link = ({canDrop, isOver, connectDropTarget, list, active,
  onSelect}) =>
{
  let element = (
    <div>
      <Link to={`/list/${list}`}
        onClick={onSelect}
        className={'list' + (canDrop ? ' droppable' : '') +
          (isOver ? ' drop_hover' : '') + (active ? ' active' : '')}>
        {list}
      </Link>
    </div>
  )
  return list == 'All' ? element : connectDropTarget( element )
}

const FakeNavLink = ({name}) => (
  <div className="list fake">{name}</div>
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
            + (active ? ' active ' : '')}>
          Clear lists
        </div>
      </CSSTransitionGroup>}
  </div>
)

const SidebarList = DropTarget('todo', {
  drop (props, monitor) {
    let todo = monitor.getItem()
    // HACK josh: modifying object in place is not the correct way to do this.
    // Add some sort of update bus
    todo.list = _.uniq((todo.list || []).concat([props.list]))
    api(`/todos/${todo._id}`, {method: 'PATCH', body: todo})
  },
}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
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
    this.state = {new_list: '', open: false}
    this.create_list = this.create_list.bind(this)
  }
  on_change (e) {
    let {target} = e
    this.setState({[target.name]: target.value})
  }
  async create_list (e) {
    e.preventDefault()
    if (await this.props.onCreateList(this.state.new_list)) {
      this.setState({new_list: '', open: false})
    }
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
      return a < b ? -1 : 1
    })
    let {open} = this.state
    let loading = !lists.length
    if (loading) {
      return (
        <div className="sidebar">
          <div className="lists">
            <FakeNavLink name="Inbox"/>
            <FakeNavLink name="All"/>
          </div>
        </div>
      )
    }
    return (
      <div className="sidebar">
        <div className={`d-xs-flex d-sm-none ${open ? 'mb-2' : ''}`}>
          <button className="btn btn-sm btn-link"
            onClick={() => this.setState({open: !open})}>
            {open ? '- Hide' : '+ Show'} lists
          </button>
          <i className="ml-auto fa fa-hamburger"/>
        </div>
        <div className={`lists ${!open ? 'd-none' : ''} d-sm-block`}>
          {lists.map(list =>
            <SidebarList key={list} list={list} active={list === current}
              onSelect={() => this.setState({open: false})}/>)}
          <ClearButton/>
          <form className="input-group" onSubmit={this.create_list}>
            <input name="new_list" className="form-control form-control-sm"
              value={new_list} onChange={e=>this.on_change(e)}
              placeholder="New list"/>
            {new_list &&
              <div className="input-group-btn">
                <button className="btn btn-sm btn-primary">
                  <i className="fa fa-plus"/>
                </button>
              </div>}
          </form>
        </div>
      </div>
    )
  }
}
