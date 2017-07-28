import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import _ from 'lodash'

export default class AccountPage extends Component {
  constructor (props) {
    super(props)
    this.state = {user: null}
    this.sync_wunderlist = this.sync_wunderlist.bind(this)
    this.load_user()
  }
  load_user () {
    // TODO josh: use api module when available
    fetch('/api/account').then(res => res.json())
    .then(user => this.setState({user}))
    .catch(err => console.error(err))
  }
  sync_wunderlist (event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({sync_status: 'Syncing...', sync_error: null})
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    // TODO josh: use api module when available
    fetch('/api/lists/import', {
      method: 'POST',
      body: JSON.stringify({source: 'wunderlist'}),
      headers,
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        return this.setState({sync_error: data.error, sync_status: null})
      }
      this.setState({
        sync_status: `Synced ${data.sync.items} items from ${data.sync.lists} lists`,
      })
    })
    .catch(err => {
      this.setState({
        sync_error: `Error: ${err.message}`,
        sync_status: null,
      })
    })
  }
  render () {
    if (!this.state.user) {
      return <p>Loading...</p>
    }
    let user = this.state.user
    let wunderlist_id = _(user).get('external.wunderlist.id')
    return (
      <div>
        <h1>Account</h1>
        <p>Username: {user.username}</p>
        {wunderlist_id &&
          <p>
            Wunderlist ID: {wunderlist_id}{' '}
            <a href="#" onClick={this.sync_wunderlist}>sync lists</a>{' '}
            {this.state.sync_status && <span>{this.state.sync_status}</span>}
            {this.state.sync_error &&
              <span className="text-error">{this.state.sync_error}</span>}
          </p>}
        {!wunderlist_id &&
          <p>
            Wunderlist ID: <a href="/auth/wunderlist">link Wunderlist</a>
          </p>}
        <Link to="/lists">&larr; home</Link>
      </div>
    )
  }
}