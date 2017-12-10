import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import keys from './keys'
import api_request from './api.js'

export default class ListItem extends Component {
  constructor(props) {
    super(props)
    this.state = { todo: null, edit: false }
    this.toggle_button = this.toggle_button.bind(this)
    this.edit_title = this.edit_title.bind(this)
    this.save_title = this.save_title.bind(this)
    this.cancel_edit = this.cancel_edit.bind(this)
    this.props = props
  }
  componentDidMount() { this.set_props(this.props) }
  componentWillReceiveProps(props) { this.set_props(props) }
  set_props(props) {
    this.setState({ edit: false, todo: props.todo })
  }
  update(update) {
    api_request(`/todos/${this.state.todo._id}`, {
      method: 'PATCH',
      body: update,
    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Not updated correctly')
      }
      return res.json()
    })
    .then(todo => this.props.modified(todo))
    // TODO josh: notify some alert service instead of just logging to console
    .catch(err => console.error(err))
  }
  edit_title(e) { this.setState({ edit: true }) }
  cancel_edit(e) {
    if (e.keyCode === keys.ESCAPE) {
      this.setState({ edit: false })
    }
    if (e.keyCode === keys.ENTER) {
      this.save_title(e)
    }
  }
  componentDidUpdate(e) {
    if (this.state.edit) {
      this.refs.edit_todo_title.select()
    }
  }
  toggle_button(e) { this.update({ completed: e.target.checked }) }
  save_title(e) { this.update({ title: e.target.value }) }
  render() {
    let todo = this.state.todo
    if (!todo) {
      return todo
    }
    let check_id = 'completed-' + todo._id
    return (
      <li className={'todo_item' + (todo.completed ? ' completed' : '')}>
        <span className="input-group">
          <input
            type="checkbox"
            id={check_id}
            defaultChecked={todo.completed}
            onChange={this.toggle_button} />
          <label htmlFor={check_id} />
        </span>
        <Link to={`/todo/${todo._id}`}>{todo.title}</Link>
        {(todo.list||[]).map(l =>
          <Link key={l} to={`/list/${l.toLowerCase()}`}
            className="button list_link">{l}</Link>)}
      </li>
    )
  }
}
