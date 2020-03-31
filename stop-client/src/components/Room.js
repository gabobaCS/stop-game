import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';

export default class Room extends Component {
    constructor(props){
        super(props)

        this.state = {
            isUserLoggedIn: (sessionStorage.getItem('id') ==  this.props.socket.id) ? true : false
        }
    }
    componentDidMount(){
        console.log(this.props.match.params.roomName)
        //Log user to room on same socket connection
        if(this.state.isUserLoggedIn){
            //Dyanmically join room.
            if(sessionStorage.getItem('room') != this.props.match.params.roomName){
                this.props.socket.emit('join room', {username: sessionStorage.getItem('username'), room: this.props.match.params.roomName, id:this.props.socket.id})
            }
        }

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
            //Hanlde state
            this.setState({
                isUserLoggedIn: true
            })
        })

        //Handles unsuccesful login
        this.props.socket.on('username already in use', () => {
            this.props.history.push('/')
        })
        
        //Handles succesful room joining
        this.props.socket.on('succesful room join', (userObject) => {
            sessionStorage.setItem('room', userObject.room);
            console.log(userObject.username + ' has succesfully joined: ' + userObject.room)
        })
    }
    //TODO CHECK IF THIS IS THIS IS THE APPROPRIATE METHOD
    componentDidUpdate(prevProps, prevState) {
        if (prevState.isUserLoggedIn !== this.state.isUserLoggedIn || this.state.isUserLoggedIn) {
          console.log('user has now logged in')
          console.log(this.state.isUserLoggedIn)
            //Log user to room on different socket connection
            if(this.state.isUserLoggedIn){
                //Dynamically join room.
                if(sessionStorage.getItem('room') != this.props.match.params.roomName){
                    this.props.socket.emit('join room', {username: sessionStorage.getItem('username'), room: this.props.match.params.roomName, id:this.props.socket.id})
                }
            }
        }
    }
    render() {
        if (sessionStorage.getItem('username') == null){
            return (<Redirect to='/' />)
        }
        return (
            <div>
                gg
            </div>
        )
    }
}
