import React from 'react'
import {render} from 'react-dom'
import {Router, Route, Switch, Redirect} from 'react-router-dom'
import Nav from './Nav.jsx'
import TodoApp from './TodoApp.jsx'
import AccountPage from './AccountPage.jsx'
import createBrowserHistory from 'history/createBrowserHistory'
import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContextProvider} from 'react-dnd'

let app =
  <DragDropContextProvider backend={HTML5Backend}>
    <Router history={createBrowserHistory()}>
      <div className="app container-fluid">
        <Nav/>
        <Route path="/account" component={AccountPage}/>
        <Route path="/" exact render={()=><Redirect to="/list/Inbox"/>}/>
        <Route path="/list/:list" component={TodoApp}/>
      </div>
    </Router>
  </DragDropContextProvider>
render(app, document.querySelector('#app'))
