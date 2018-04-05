import React, {Component} from 'react'
import {createPortal} from 'react-dom'
import classnames from 'classnames'

export default class PopCard extends Component {
  constructor(props) {
    super(props)
    this.state = {open: false}
    this.root = document.querySelector('#body-portal')
    this.el = document.createElement('div')
  }
  componentDidMount() {
    this.root.appendChild(this.el)
  }
  componentWillUnmount() {
    this.root.removeChild(this.el)
  }
  componentWillReceiveProps() {
    if (this.state.open) {
      this.setState({open: false})
    }
  }
  render() {
    let {children, render, className, align} = this.props
    let {open} = this.state
    return (
      <div
        className={classnames(
          'popup-card',
          align === 'right' && 'align-right',
          className,
        )}
      >
        <div className="toggle" onClick={() => this.setState({open: true})}>
          {render}
        </div>
        {open && <div className="card">{children}</div>}
        {createPortal(
          open && (
            <div
              className="backdrop"
              onClick={() => this.setState({open: false})}
            />
          ),
          this.el,
        )}
      </div>
    )
  }
}
