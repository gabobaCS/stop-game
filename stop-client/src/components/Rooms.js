import React, { Component } from 'react';
import {Redirect, Link} from 'react-router-dom';


export default class Rooms extends Component {
    constructor(props){
        super(props)
        this.state = {
            existingRooms: []
        }

    }

    componentDidMount(){
        //Handles user getting into the route directly by comparing Socket ID.
        if (sessionStorage.getItem('id') == this.props.socket.id){
            console.log('same session')
        }
        else{
            console.log('not same session')
        }
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
            this.props.socket.emit('leave room', {username: sessionStorage.getItem('username'), room: sessionStorage.getItem('room'), id:sessionStorage.getItem('id')});
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

    render(){
        console.log(this.state.existingRooms)
        //Checks if user is logged in in sessionStorage
        if (sessionStorage.getItem('username') == null){
            return (<Redirect to='/' />)
        }
        return (
            <div>
                <ul>
                    <li><Link to='/rooms/Room1'>Room1</Link></li>
                    {this.state.existingRooms.map((roomObject, index) => (
                    <li key={roomObject.roomName}><Link to={`/rooms/${roomObject.roomName}`}>{roomObject.roomName}</Link></li>
                        ))}
                </ul>
            </div>
        )
    }
}
