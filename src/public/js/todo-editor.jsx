import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import keys from './keys'
import api_request from './api.js'

export default class ListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {todo: null}
    api_request(`/todos/${props.todo}`).then(res => res.json()).then(todo => {
      this.setState({todo})
    })
  }
  render() {
    let {todo} = this.state
    if (!todo) {
      return <p>Loading...</p>
    }
    return (
      <div>
        <div className="row">
          <h3>{todo.title}</h3>
          <div className="ml-auto">
            <span className="close"
              onClick={this.context.router.history.goBack}/>
          </div>
        </div>
      </div>
    )
  }
}
ListItem.contextTypes = {router: PropTypes.object}
