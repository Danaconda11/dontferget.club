import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'

export default () => (
  <div className="navbar">
    <NavLink to="/" className="nav-item" title="Todos">
      <i className="fa fa-2x fa-check-square" />
    </NavLink>
    <NavLink to="/account" className="nav-item" title="Account">
      <i className="fa fa-2x fa-user" />{' '}
    </NavLink>
    <a href="/logout" className="nav-item log-out ml-auto" title="Log out">
      <i className="fa fa-2x fa-sign-out" />{' '}
    </a>
  </div>
)
