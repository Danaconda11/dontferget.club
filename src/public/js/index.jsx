import React from 'react'
import {render} from 'react-dom'
import {Router, Route} from 'react-router-dom'
import Nav from './nav.jsx'
import TodoApp from './app.jsx'
import Chess from './chess.jsx'
import Account from './account.jsx'
import createBrowserHistory from 'history/createBrowserHistory'

let app =
<Router history={createBrowserHistory()}>
  <div className="app">
    <Nav/>
    <Route exact path="/" component={TodoApp}/>
    <Route path="/games/chess" component={Chess}/>
    <Route path="/account" component={Account}/>
  </div>
</Router>
render(app, document.querySelector('#app'))
