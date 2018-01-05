import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Todo, {FakeTodo} from './Todo.jsx'
// TODO josh: consider lazy-loading react-modal, react-toggle
import Modal from 'react-modal'
import Toggle from 'react-toggle'
import CopyUrl from './CopyUrl.jsx'

export default class TodoList extends Component {
  constructor (props) {
    super(props)
    this.state = {new_todo: '', hover: null, view_settings: false}
    this.on_drop_hover = this.on_drop_hover.bind(this)
    this.on_drop = this.on_drop.bind(this)
    this.on_sharing_update = this.on_sharing_update.bind(this)
  }
  on_sharing_update (e) {
    this.props.onListUpdate(this.props.list.name,
      {[`sharing.${e.target.name}`]: e.target.checked})
  }
  on_drop_hover (index, todo) { this.setState({hover: {index, todo}}) }
  on_drop (...args) {
    this.setState({hover: null})
    this.props.onSort(...args)
  }
  render () {
    let {new_todo, hover, view_settings} = this.state
    let {todos, loading, onTodoCreate, onTodoUpdate, showDone, list} = this.props
    if (!list) {
      // TODO josh: extract generic <Loading/>
      return <p>Loading...</p>
    }
    let {sort, sharing} = list
    let _todos = todos.slice()
    if (hover) {
      let current_index = todos.findIndex(t => t._id==hover.todo._id)
      if (![current_index, current_index+1].includes(hover.index)) {
        _todos.splice(hover.index, 0,
          Object.assign({is_ghost: true}, hover.todo))
      }
    }
    // TODO josh: sort in TodoApp to avoid resorting the list every render
    _todos = _todos.sort((a, b) => {
      if (!sort || a.is_ghost || b.is_ghost ||
        (!sort.includes(a._id) && !sort.includes(b._id)))
      {
        return
      }
      // todos not in the sort order get pushed to the top of the list
      if (!sort.includes(a._id)) {
        return -1
      }
      if (!sort.includes(b._id)) {
        return -1
      }
      return sort.indexOf(a._id) - sort.indexOf(b._id)
    })
    // TODO josh: split out <ListSettings/>
    return (
      <div className="todo_list">
        <header className="d-flex">
          <h3 className="mr-2">{list.name}</h3>
          <i className="settings_icon fa fa-gear"
            onClick={() => this.setState({view_settings: true})}/>
          <div className="ml-auto">
            <Link className={'btn btn-sm ' + (showDone ? 'btn-link' : 'btn-primary')}
              to={`/list/${list.name}`}>
              Doing
            </Link>
            <Link className={'btn btn-sm ' + (!showDone ? 'btn-link' : 'btn-primary')}
              to={`/list/${list.name}?done=true`}>
              Done
            </Link>
          </div>
        </header>
        <form onSubmit={e => {
          e.preventDefault()
          let todo = {title: new_todo, completed: false}
          if (list.name && list.name !== 'all') {
            todo.list = [list.name]
          }
          this.setState({new_todo: ''})
          onTodoCreate(todo)
        }} className="new_todo d-flex">
          <div className="input-group">
            <input placeholder="Buy milk..." value={new_todo}
              onChange={e => this.setState({new_todo: e.target.value})}
              className="form-control" autoFocus={true} />
            <div className="input-group-btn">
              <button className="btn btn-outline-success" disabled={!new_todo}>
                <i className="fa fa-plus"/>
              </button>
            </div>
          </div>
        </form>
        <ul className="todo_items">
          {loading ?
            <div>
              <FakeTodo text="Milk" list={list.name}/>
              <FakeTodo text="Bread" list={list.name}/>
              <FakeTodo text="Cheese" list={list.name}/>
            </div> :
            _todos.map((todo, i) =>
              <Todo
                key={todo.is_ghost ? 'ghost' : todo._id}
                index={i}
                onUpdate={onTodoUpdate}
                isGhost={todo.is_ghost}
                onDropHover={this.on_drop_hover}
                onSort={this.on_drop}
                todo={todo}
                list={list.name}/>)}
        </ul>
        <Modal isOpen={view_settings} ariaHideApp={false}
          onRequestClose={() => this.setState({view_settings: false})}>
          <h3>{list.name} settings</h3>
          <h4>Sharing</h4>
          <div className="d-flex ai-center">
            <Toggle name="public" id="public_sharing" className="mr-1"
              checked={sharing.public} onChange={this.on_sharing_update}/>
            <label className="mr-1" htmlFor="public_sharing">Public</label>
            {sharing.public && <CopyUrl>{`https://dontferget.club/list/${list.uuid}`}</CopyUrl>}
          </div>
          <div className="d-flex ai-center">
            <Toggle name="private" id="private_sharing" className="mr-1"
              checked={!!sharing.private} onChange={this.on_sharing_update}/>
            <label className="mr-1" htmlFor="private_sharing">Private</label>
            {sharing.private && <CopyUrl>{`https://dontferget.club/list/${sharing.private}`}</CopyUrl>}
          </div>
        </Modal>
      </div>
    )
  }
}
