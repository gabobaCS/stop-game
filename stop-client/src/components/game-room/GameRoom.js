import React, { Component } from 'react';
import './styling/GameRoom.css';
import Cross from '../Cross.js';
import UsersData from './UsersData.js';
import Lobby from './screens/Lobby.js';
import {Redirect} from 'react-router-dom';

export default class GameRoom extends Component {
    constructor(props){
        super(props)
        this.state = {
            roomName: this.props.match.params.roomName,
            isUserLoggedIn: (sessionStorage.getItem('id') ==  this.props.socket.id) ? true : false,
            usersInRoom: [],
            dataReceived: false,
            roomData: []
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
            console.log('here')
            console.log(userObject.username + ' has succesfully joined: ' + userObject.room)
        })

        //Handles duplicate requests on /rooms
        this.props.socket.removeAllListeners('list of rooms')

        /*Handles GAME requests*/

        //Asks socket for list of connected users.
        this.props.socket.emit('request usersList', this.state.roomName);
        this.props.socket.emit('request room data', this.state.roomName);
                    //Adds usersInRoom to state.
                    // this.props.socket.on('users in room', (usersInRoomList) => {
                    //     console.log('Users in Room');
                    //     console.log(usersInRoomList);
                    //     if (this.state.usersInRoom = []){
                    //         this.setState({
                    //             usersInRoom: usersInRoomList
                    //         })
                    //     }
                    // })
        //Adds room data to state
        this.props.socket.on('room data', (roomData) => {
            console.log('received room data')
            console.log(roomData)
            this.setState({
                'roomData': roomData,
                dataReceived: true
            })
        })

        this.props.socket.on('all players ready in lobby', (roomObject) => {
            this.setState({
                'roomData': roomObject
            })
            console.log(roomObject)
            console.log('All users ready')
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
                    this.props.socket.emit('request usersList', this.state.roomName);
                }
            }
        }
    }

    render() {
        if (sessionStorage.getItem('username') == null){
            return (<Redirect to='/' />)
        }
        console.log()
        return (
            <div className='game-room-canvas'>
                <div onClick={() => this.props.history.push('/rooms')}>
                    <Cross />
                </div>
                <h2 className='room-title'>{this.state.roomName}</h2>
                <div className='room-flex'>
                    <UsersData gameState={this.state.roomData.gameState} dataReceived={this.state.dataReceived} usersInRoom={(this.state.dataReceived)?this.state.roomData.usersInRoom:null}/>
                    <div className='game-room-flex-spacer'></div>
                    <Lobby socket={this.props.socket} roomData={this.state.roomData}/>
                </div>
            </div>
        )
    }
}
