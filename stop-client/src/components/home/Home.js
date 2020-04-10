import React, { Component } from 'react';
import './Home.css'
import CreateRoomButtonSVG from '../../assets/create-room-button.svg';
import JoinARoomButtonSVG from '../../assets/join-a-room-button.svg';
import ModalLogin from './ModalLogin.js'

export default class Home extends Component {
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            isUserLoggedIn: (sessionStorage.getItem('id') ===  this.props.socket.id) ? true : false
        }
    }

    componentDidMount(){
        //Handle user login on existing sessionStorage
        if (sessionStorage.getItem('username') != null && sessionStorage.getItem('id') !=  this.props.socket.id){
            console.log('user has logged in in the past but this is a new connection')
            //Attempt login user
            this.props.socket.emit('try login', sessionStorage.getItem('username'))
        }

        //Updates sessionStorage on succesful login
        this.props.socket.on('succesful login', (username) => {
            console.log('logged: ' + username);
            //Adds user to sessionStorage
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('room', null);
            sessionStorage.setItem('id', this.props.socket.id);
            //Handle state
            this.setState({
                isUserLoggedIn: true
            })
        })

        //Automatically unjoins user from any room on reaching page, after checking that user is connected.
        if (sessionStorage.getItem('username') != null && sessionStorage.getItem('room') != null){
            console.log('should leave room')
            this.props.socket.emit('leave room', {username: sessionStorage.getItem('username'), room: sessionStorage.getItem('room'), id:sessionStorage.getItem('id')});
            //Handles duplicate messages in room by removing listener.
            this.props.socket.removeAllListeners('succesful room join')
            sessionStorage.setItem('room', null)
        }

        this.props.socket.removeAllListeners('invalid room')
    }

    handleClick(event){
        console.log(event.target.alt)
        if (event.target.alt == 'Create Room'){
            this.props.history.push('/create-room')
        }
        if (event.target.alt == 'Join a Room'){
            this.props.history.push('/rooms')
        }
    }
    render() {
        console.log(this.props.socket)
        console.log(this.state.isUserLoggedIn)
        return (
            <React.Fragment>
                <ModalLogin socket={this.props.socket} isUserLoggedIn={this.state.isUserLoggedIn} />
                <h1>STOP Online</h1>
                <div id='create-room-button-wrapper'>
                    <img src={CreateRoomButtonSVG} alt="Create Room" onClick={this.handleClick} />
                        <div className='spacer'></div>
                    <img src={JoinARoomButtonSVG} alt="Join a Room" onClick={this.handleClick} />
                </div>
            </React.Fragment>

        )
    }
}
