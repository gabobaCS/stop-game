import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

export default class Room extends Component {
    constructor(props){
        super(props)
        this.state = {
            socket:  socketIOClient("http://127.0.0.1:4000")
        }
    }

    componentDidMount(){
        this.state.socket.emit('join room', this.props.match.params.name)
        this.state.socket.on('message', (msg) => {
            console.log(msg)
        })
        
    }

    render() {

        return (
            <div>
               {this.props.match.params.name}
            </div>
        )
    }
}
