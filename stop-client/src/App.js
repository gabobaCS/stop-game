import React, { Component } from 'react';
import Login from './components/Login.js';
import Rooms from './components/Rooms.js';
import Room1 from './components/Room1.js';
import CreateRoom from './components/CreateRoom.js'
import socketIOClient from "socket.io-client";
import {
    BrowserRouter as Router,
    Route,
  } from "react-router-dom";

export default class App extends Component {
    constructor(){
        super()
        this.state = {
            endpoint: "http://127.0.0.1:4000",
            socket: '',
            isUserLoggedIn: false
        }
    }

    componentDidMount(){
        if (this.state.socket === '') {
            this.setState({
                socket: socketIOClient(this.state.endpoint) 
            });
            console.log('established connection')
        } 
    }
    render() {
        //Renders only if socket connection has been established
        if (this.state.socket != ''){
            return (
                <Router>               
                    <Route
                    exact path='/'
                    render={(props) => <Login {...props} socket={this.state.socket} />}
                    />    
                    <Route
                    exact path='/rooms'
                    render={(props) => <Rooms {...props} socket={this.state.socket} />}
                    />
                    <Route
                    exact path='/rooms/room1'
                    render={(props) => <Room1 {...props} socket={this.state.socket} />}
                    />
                    <Route
                    exact path='/create-room'
                    render={(props) => <CreateRoom {...props} socket={this.state.socket} />}
                    />                   
                </Router>
            )
        }
        return (<h3>Loading...</h3>)

    }
}
