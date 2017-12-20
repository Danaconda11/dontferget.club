import React, {Component} from 'react'

export default class PrettyInput extends Component {
  constructor (props) {
    super(props)
    this.state = {editing: false}
    this.save = this.save.bind(this)
  }
  componentWillReceiveProps (next) {
    if (this.state.editing) {
      this.setState({editing: false})
    }
  }
  save () {
    this.props.onChange(this.state.value)
  }
  render () {
    let {editing, state, value} = this.state
    let {oneLine} = this.props
    if (editing) {
      if (oneLine) {
        return <input value={value} autoFocus className="form-control"
          onChange={e => this.setState({value: e.target.value})}
          onBlur={this.save}/>
      }
      return <textarea value={value} autoFocus className="form-control"
        onChange={e => this.setState({value: e.target.value})}
        onBlur={this.save}/>
    }
    return (
      <div className="pretty_input"
        onClick={() => this.setState({editing: true, value: this.props.value})}>
        <i className="fa fa-pencil edit"/>
        {this.props.children}
      </div>
    )
  }
}
