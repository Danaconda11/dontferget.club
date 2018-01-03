import React from 'react'

export default function CopyUrl ({children}) {
  // TODO josh: this should be a text input with a copy button
  return <a href={children}>share link</a>
}
