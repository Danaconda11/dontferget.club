import React from 'react'
import {render} from 'react-dom'
import {Router, Route, Switch} from 'react-router-dom'
import Nav from './nav.jsx'
import Todos from './todos.jsx'
import Chess from './chess.jsx'
import Account from './account.jsx'
import createBrowserHistory from 'history/createBrowserHistory'

let app =
<Router history={createBrowserHistory()}>
  <div className="app container">
    <Nav/>
    <Switch>
      <Route path="/games/chess" component={Chess}/>
      <Route path="/account" component={Account}/>
      <Route path="/" component={Todos}/>
    </Switch>
  </div>
</Router>
render(app, document.querySelector('#app'))
