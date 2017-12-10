import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'

export default () => (
  <div>
    <NavLink to="/" className="nav_link" title="Todos">
      <i className="fa fa-2x fa-check-square"/></NavLink>
    <NavLink to="/games/chess" className="nav_link" title="Dan's chess stats">
      <i className="fa fa-2x fa-trophy"/></NavLink>
    <NavLink to="/account" className="nav_link" title="Account">
      <i className="fa fa-2x fa-user"/> </NavLink>
  </div>
)
