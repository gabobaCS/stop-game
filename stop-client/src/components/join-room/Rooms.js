import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';
import Cross from '../Cross.js';
import './Rooms.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faKeyboard, faPen } from '@fortawesome/free-solid-svg-icons'

export default class Rooms extends Component {
    constructor(props){
        super(props)
        this.formatRoomList = this.formatRoomList.bind(this)
        this.state = {
            existingRooms: []
        }

    }

    componentDidMount(){
        //Attemps user login if there's a sessionStorage active but it has refreshed the page or accessed it directly.
        if (sessionStorage.getItem('username') != null && sessionStorage.getItem('id') != this.props.socket.id){
            console.log('theres a username but not redirected')
            this.props.socket.emit('try login', sessionStorage.getItem('username'))
        }
        //Updates sessionStorage on succesful login.
        this.props.socket.on('succesful login', (username) => {
            console.log('logged: ' + username);
            //Adds user to sessionStorage
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('room', null);
            sessionStorage.setItem('id', this.props.socket.id);
        })
        //Redirects on unsuccesful login
        this.props.socket.on('username already in use', () => {
            this.props.history.push('/')
        })
        //Automatically unjoins user from any room on reaching page, after checking that user is connected.
        if (sessionStorage.getItem('username') != null && sessionStorage.getItem('room') != null){
            console.log('should leave room')
            this.props.socket.emit('leave room', {username: sessionStorage.getItem('username'), room: sessionStorage.getItem('room'), id:sessionStorage.getItem('id')});
            //Handles duplicate messages in room by removing listener.
            this.props.socket.removeAllListeners('succesful room join')
            sessionStorage.setItem('room', null)
        }

        //On mount requests list of rooms from server.
        this.props.socket.emit('request list of rooms')

        //Updates state with list of rooms.
        this.props.socket.on('list of rooms', (existingRooms) => {
            this.setState({
                'existingRooms': existingRooms 
            })
        })
    }

    formatRoomList(){
        console.log(this.state.existingRooms)
        let roomListJSX = this.state.existingRooms.map((roomObject, index) => (
            <li key={roomObject.roomName}>
                <Link style={{ textDecoration: 'none' }} to={`/rooms/${roomObject.roomName}`}>
                    <div className='rooms-list-item'>
                        <h2>{roomObject.roomName}</h2>
                        <div className='room-li-right'>
                            <h3 className=''>{roomObject.usersInRoom.length}</h3>
                            <FontAwesomeIcon icon={faUsers} className='middle-icon' />
                            {(roomObject.inputType == 'typed')?<FontAwesomeIcon icon={faKeyboard} style={{fontSize: '47px'}} /> :<FontAwesomeIcon icon={faPen} />}
                        </div>
                    </div>                   
                </Link>
            </li>
        ))
        return roomListJSX    
    }

    render(){
        //Checks if user is logged in in sessionStorage
        if (sessionStorage.getItem('username') == null){
            return (<Redirect to='/' />)
        }
        return (
            <div className='canvas-join-room'>
                <h2 className='title'>Join a Room</h2>
                <div onClick={() => this.props.history.push('/')}>
                        <Cross />
                </div>

                <ul className='room-list'>
                    {this.formatRoomList()}
                </ul>
            </div>
        )
    }
}
