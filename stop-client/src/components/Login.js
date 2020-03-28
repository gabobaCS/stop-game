import './Login.css';
import React, { Component } from "react";
import {Redirect} from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      username: '',
      submitDisabled: true,
      validUsername: true,
      userLogged: false,
    };
  };

  componentDidMount(){
    console.log(this.props)
    //Handles login on succesful server response
    this.props.socket.on('succesful login', (username) => {
      console.log(this.state.username + ' has succesfully logged in');
      console.log(username);
      this.setState({
        userLogged: true
      })
      //Adds user to sessionStorage
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('room', null);
      sessionStorage.setItem('id', this.props.socket.id);

      //Redirects to rooms route
      this.props.history.push('/rooms')
    })

    this.props.socket.on('username already in use', () => {

      this.setState({
        validUsername: false,
      })
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
    console.log('will attempt login')
    //Checks if the same username is already in use
    this.props.socket.emit('try login', this.state.username)
    this.setState({
      validUsername: true
    })

  }

  render() {
    //Redirects user if already logged into sessionStorage
    if (sessionStorage.getItem('username') != null){
      return(
        <Redirect to={{pathname: '/rooms', state: { redirected: true }} } />
      )
    }
    return (
      <div className='login'>
        <form onSubmit={this.handleSubmit}>
          <label>Username:</label><br />
          <input type="text" value={this.state.username} onChange={this.handleChange} /><br />
          <button type="submit" disabled={this.state.submitDisabled || this.state.userLogged}> Login User </button>
          {this.state.validUsername? '': <h3>Please try a different username</h3>}
        </form>
      </div>
    );
  }
}

export default Login;