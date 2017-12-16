import React, {Component} from 'react'
import {NavLink, Link} from 'react-router-dom'
import api from './api.js'

export default class SideBar extends Component {
  constructor (props) {
    super(props)
    this.state = {lists: [], new_list: ''}
    api('/lists').then(res => res.json()).then(lists => this.setState({lists}))
  }
  on_change (e) {
    let {target} = e
    this.setState({[target.name]: target.value})
  }
  render() {
    let {lists, new_list} = this.state
    return (
      <div className="sidebar">
        {lists.map(list =>
          <NavLink key={list} to={`/list/${list}`} className="list">
            {list}</NavLink>)}
        <div className="d-flex">
          {/* HACK josh: div wrapper because flexbox isn't shrinking children on firefox */}
          <div>
            <input name="new_list" className="new_list" value={new_list}
              onChange={e=>this.on_change(e)} placeholder="New list"/>
          </div>
          {/* HACK josh: div wrapper because flexbox isn't shrinking children on firefox */}
          {new_list &&
            <Link to={`/list/${new_list}`} className="new_list_btn"
              onClick={() => this.setState({new_list: ''})}>
              <i className="fa fa-plus"/>
            </Link>
            }
        </div>
      </div>
    )
  }
}
