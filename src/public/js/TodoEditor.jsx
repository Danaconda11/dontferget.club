import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import PrettyInput from './PrettyInput.jsx'
import api_request from './api.js'
import _ from 'lodash'
const {assign} = Object

export default class TodoEditor extends Component {
  save(update) {
    let {todo} = this.props
    this.props.onUpdate(todo._id, assign({}, todo, update))
  }
  render() {
    let {todo} = this.props
    return (
      <div className="todo_editor card">
        <div className="card-body">
          <div className="card-title">
            <PrettyInput
              value={todo.title}
              oneLine={true}
              onChange={v => this.save({title: v})}
            >
              <h4>{todo.title}</h4>
            </PrettyInput>
          </div>
          <PrettyInput value={todo.notes} onChange={v => this.save({notes: v})}>
            <div className="card-text">
              {todo.notes || <span className="text-muted">Notes</span>}
            </div>
          </PrettyInput>
        </div>
      </div>
    )
  }
}
