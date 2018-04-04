import React from 'react'
import {StaticRouter} from 'react-router-dom'
import TodoList from '../TodoList.jsx'

export default function ReadOnlyTodoList({list, todos, url}) {
  return (
    <StaticRouter location={url} context={{}}>
      <TodoList list={list} todos={todos} />
    </StaticRouter>
  )
}
