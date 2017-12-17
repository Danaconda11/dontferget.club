import React from 'react'
import {render} from 'react-dom'
import {Router, Route, Switch, Redirect} from 'react-router-dom'
import Nav from './nav.jsx'
import TodoList from './todo-list.jsx'
import Chess from './chess.jsx'
import Account from './account.jsx'
import createBrowserHistory from 'history/createBrowserHistory'
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContextProvider} from 'react-dnd'

let app =
  <DragDropContextProvider backend={HTML5Backend}>
    <Router history={createBrowserHistory()}>
      <div className="app container-fluid">
        <Nav/>
        <Route path="/games/chess" component={Chess}/>
        <Route path="/account" component={Account}/>
        <Route path="/" exact render={()=><Redirect to="/list/Inbox"/>}/>
        <Route path="/list/:list" component={TodoList}/>
      </div>
    </Router>
  </DragDropContextProvider>
render(app, document.querySelector('#app'))
