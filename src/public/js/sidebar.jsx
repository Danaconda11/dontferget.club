import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class SideBar extends Component {
  render() {
    return (
      <div className="sidebar">
        <NavLink to="/" className="list">Inbox</NavLink>
        <NavLink to="/all" className="list">All</NavLink>
      </div>
    )
  }
}
