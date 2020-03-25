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
      socket: socketIOClient("http://127.0.0.1:4000"),
      room_name: '',
      available_rooms: []
    };
  }

  componentDidMount() {
    this.state.socket.on('roomlist', rooms => {
      this.setState({
        available_rooms: rooms
      })

    });
  }

  handleChange(event){
    this.setState({
      room_name: event.target.value
    })
  }

  handleSubmit(event){
    event.preventDefault();
    this.state.socket.emit('create room', this.state.room_name)
  }

  render() {
    const roomList = this.state.available_rooms.map((room) =>
      <Link className="link" to={`/room/${room}`}><li>{room}</li></Link>
    );
    return (
      <div className='app'>

        <form onSubmit={this.handleSubmit}>
          <label for="fname">Room Name:</label><br/>
          <input type="text" id="fname" name="fname" value={this.state.room_name} onChange={this.handleChange}/><br/>
          <input type="submit" value="Create Room"/>
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