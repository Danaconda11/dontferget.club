import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import PrettyInput from './PrettyInput.jsx'
import api_request from './api.js'
import _ from 'lodash'
const {assign} = Object

export default class TodoEditor extends Component {
  save (update) {
    let {todo} = this.props
    this.props.onUpdate(todo._id, assign({}, todo, update))
  }
  render() {
    let {todo} = this.props
    return (
      <div>
        <div className="d-flex">
          <PrettyInput value={todo.title} oneLine={true}
            onChange={v => this.save({title: v})}>
            <h3>{todo.title}</h3>
          </PrettyInput>
          <div className="ml-auto">
            <span className="close" onClick={() => this.params.onClose()}/>
          </div>
        </div>
        <PrettyInput value={todo.notes} onChange={v => this.save({notes: v})}>
          <div className="card">
            <div className="card-body">
              {todo.notes || <span className="text-muted">Notes</span>}
            </div>
          </div>
        </PrettyInput>
      </div>
    )
  }
}
