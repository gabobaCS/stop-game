import './Login.css';
import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      username: '',
      submitDisabled: true,
    };
  }

  componentDidMount(){
    console.log(this.props)
    this.props.socket.on('succesful login', (connectedUsers) => {
      console.log(this.state.username + ' has succesfully logged in');
      console.log(connectedUsers)
    })
  }

  handleChange(event) {
    let textValid = event.target.value ? true : false;
    this.setState({
      username: event.target.value,
      submitDisabled: !textValid
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.socket.emit('try login', this.state.username)

  }

  render() {
    return (
      <div className='login'>
        <form onSubmit={this.handleSubmit}>
          <label>Username:</label><br />
          <input type="text" value={this.state.username} onChange={this.handleChange} /><br />
          <button type="submit" disabled={this.state.submitDisabled}> Login User </button>
        </form>
      </div>
    );
  }
}

export default Login;