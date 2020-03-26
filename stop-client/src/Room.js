import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

export default class Room extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            socketConn: '',
            endpoint: "http://127.0.0.1:4000",
            socketID: '',
            clientName: '',
            userNameSet: false,
            clientList: [],
            submitDisabled: true
        }
    }

    componentDidMount() {
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        socket.emit('join room', this.props.match.params.name)
        // socket.on('message', (msg) => {
        //     console.log(msg);
        // });
        socket.on('socket id', clientID => {
            this.setState({
                socketID: clientID,
                socketConn: socket,
            });
        });

        socket.on('users in room', users_in_room => {
            this.setState({
                clientList: users_in_room
            });
        });
    }

    handleChange(event) {
        let textValid = event.target.value ? true : false;
        const test = event.target.value
        this.setState({
            submitDisabled: !textValid,
            clientName: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            userNameSet: true,
        });
        this.state.socketConn.emit('new player', this.state.clientName)
    }
    render() {
        const set_name = this.state.userNameSet;
        const user_list = this.state.clientList.map((users) =>
      <div><li>{users}</li></div>
    );
        return (
            <div>
                <div>
                    <h1>{this.props.match.params.name}</h1>
                </div>

                <div>
                    {set_name ? <div> Welcome! {this.state.clientName} </div>
                        : <form onSubmit={this.handleSubmit}>
                            <label>Set Username:</label><br />
                            <input type="text" value={this.state.clientName} onChange={this.handleChange} /><br />
                            <button type="submit" value={this.state.clientName} disabled={this.state.submitDisabled}> Ready! </button>
                        </form>
                    }
                </div>

                <div>
                    <h2> Players in room: </h2>
                    <div>
                        {user_list}
                    </div>
                </div>


            </div>
        )
    }
}
