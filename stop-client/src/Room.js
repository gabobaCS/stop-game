import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

export default class Room extends Component {
    constructor(props){
        super(props)
        this.state = {
            endpoint: "http://127.0.0.1:4000"
        }
    }

    componentDidMount(){
        const {endpoint} = this.props;
        const socket = socketIOClient(endpoint);
        socket.emit('join room', this.props.match.params.name)
        socket.on('message', (msg) => {
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
