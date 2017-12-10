import React, {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import PropTypes from 'prop-types'
import keys from './keys'
import api_request from './api.js'
import _ from 'lodash'

export default class ListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: true, todo: null}
    api_request(`/todos/${props.todo}`).then(res => res.json()).then(todo => {
      this.setState({todo, saved: _.clone(todo), loading: false})
    })
  }
  on_change (e) {
    let {target} = e
    this.setState(prev => {
      let {todo} = prev
      todo[target.name] = target.value
      return {todo}
    })
  }
  save () {
    let {todo, saved} = this.state
    if (_.isEqual(todo, saved)) {
      return
    }
    api_request(`/todos/${saved._id}`, {method: 'PATCH', body: todo})
    .then(res => res.json())
    .then(todo => this.setState({todo}))
  }
  render() {
    let {todo, loading} = this.state
    if (!todo && !loading) {
      return <Redirect to="/"/>
    }
    if (!todo) {
      return <p>Loading...</p>
    }
    return (
      <div>
        <div className="row">
          <h3>
            <input name="title" value={todo.title}
              onChange={e => this.on_change(e)}/>
          </h3>
          <div className="ml-auto">
            <span className="close"
              onClick={this.context.router.history.goBack}/>
          </div>
        </div>
        <textarea name="notes" value={todo.notes} onChange={e => this.on_change(e)}
          onBlur={() => this.save()}/>
      </div>
    )
  }
}
ListItem.contextTypes = {router: PropTypes.object}
