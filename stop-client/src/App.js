import React, { Component } from 'react';
import './App.css'
import Login from './components/Login.js';
import Rooms from './components/join-room/Rooms.js';
import Room from './components/Room.js';
import Home from './components/home/Home.js'
import CreateRoom from './components/create-room/CreateRoom.js'
import socketIOClient from "socket.io-client";
import {
    BrowserRouter as Router,
    Route
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
        console.log('On App componentDidMount') 
    }
    render() {
        //Renders only if socket connection has been established
        if (this.state.socket != ''){
            return (
                <div id='app-container'>
                    <div id='canvas'>
                        <Router>               
                            <Route
                            exact path='/'
                            render={(props) => <Home {...props} socket={this.state.socket} />}
                            />    
                            <Route
                            exact path='/rooms'
                            render={(props) => <Rooms {...props} socket={this.state.socket} />}
                            />
                            <Route
                            exact path='/rooms/:roomName'
                            render={(props) => <Room {...props} socket={this.state.socket} />}
                            />
                            <Route
                            exact path='/create-room'
                            render={(props) => <CreateRoom {...props} socket={this.state.socket} />}
                            />           
                        </Router>
                    </div>
                </div>

            )
        }
        return (<h3>Loading...</h3>)

    }
}
