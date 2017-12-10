import React, {Component} from 'react'
import {NavLink, Link} from 'react-router-dom'
import api from './api.js'

export default class SideBar extends Component {
  constructor (props) {
    super(props)
    this.state = {lists: []}
    api('/lists').then(res => res.json()).then(lists => this.setState({lists}))
  }
  render() {
    let {lists} = this.state
    return (
      <div className="sidebar">
        {lists.map(list =>
          <NavLink key={list}
            to={list === 'Inbox' ? '/' : `/list/${list.toLowerCase()}`}
            className="list">{list}</NavLink>)}
        <Link to="/list/new" className="new_list">
          <i className="fa fa-plus"/>
        </Link>
      </div>
    )
  }
}
