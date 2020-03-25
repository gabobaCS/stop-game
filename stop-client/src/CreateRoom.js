import logo from './logo.svg';
import './CreateRoom.css';
import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";

class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      room_name: '',
      available_rooms: [],
      submitDisabled: true,
      endpoint: "http://127.0.0.1:4000"
    };
  }

  //Initializing the socket to be searched for when the component loads based on the endpoint in the state.
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('roomlist', rooms => {
      this.setState({
        available_rooms: rooms,
      })
    });
  }

  handleChange(event) {
    let textValid = event.target.value ? true : false;
    this.setState({
      room_name: event.target.value,
      submitDisabled: !textValid
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('create room', this.state.room_name)
  }

  render() {
    const roomList = this.state.available_rooms.map((room) =>
      <Link className="link" to={`/room/${room}`}><li>{room}</li></Link>
    );
    return (
      <div className='app'>

        <form onSubmit={this.handleSubmit}>
          <label>Room Name:</label><br />
          <input type="text" value={this.state.room_name} onChange={this.handleChange} /><br />
          <button type="submit" disabled={this.state.submitDisabled}> Create Room </button>
        </form>
        <h3>Available Rooms:</h3>

        <ul>
          {roomList}
        </ul>

      </div>
    );
  }
}

export default CreateRoom;