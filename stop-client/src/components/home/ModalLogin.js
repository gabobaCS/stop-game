import React, { Component } from 'react'
import './ModalLogin.css'

export default class ModalLogin extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            username: '',
            formSubmitted: false,
            unsuccessfulLogin: false
        }
    }

    componentDidMount(){
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
            //Closes Modal
            this.setState({
                formSubmitted: true
            })
      })
      //Handles unsuccessful login
      this.props.socket.on('username already in use', () => {
        this.setState({
          unsuccessfulLogin: true
        })
      })   
    }

    handleChange(event){
        if (event.target.value.length < 22){
            this.setState({username: event.target.value.replace(/\s/g, "")});
        }

    }

    handleSubmit(event){
        console.log('will attempt login')
        //Checks if the same username is already in use
        this.props.socket.emit('try login', this.state.username)
        event.preventDefault()
    }
    render() {
        let Modalstyle = (this.props.isUserLoggedIn == false && this.state.formSubmitted == false) ? {display: ''} : {display:'none'}
        let usernameTakenStyle = (this.state.unsuccessfulLogin) ? {position: 'absolute'} : {display: 'none'}
        return (
            <div id='modal-login' style={Modalstyle}>
                <div className='modal-login-canvas modal-transition' >
                    <h2>Enter your username</h2>
                    <form className='modal-login-form' onSubmit={this.handleSubmit} >
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                        <h3 className='usernameTaken' style={usernameTakenStyle}> Username Taken :(</h3>
                        <div className='button-wrapper-align'>
                            <input type="submit" className='submit-button' value="Sign In" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
