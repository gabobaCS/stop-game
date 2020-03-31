import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import './CreateRoom.css'

export default class CreateRoom extends Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            roomName: '',
            category: '',
            inputType: ''
        }
    }

    componentDidMount(){
        //Attempts user login if there's a sessionStorage active but it has refreshed the page or accessed it directly.
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
        //Redirects on room created succesfully.
        this.props.socket.on('room created succesfully', () => {
            this.props.history.push('/rooms');
        })
        //Handles invalid room name.
        this.props.socket.on('invalid room', () => {
            alert('Room name is already in use');
        })
    }

    handleChange(event){ 
        //Passes html form to component's state
        switch(event.target.id){
            case 'room-name':
                this.setState({
                    roomName: event.target.value
                })
                break
            case 'add-category':
                this.setState({
                    category: event.target.value
                })
                break;
            case 'pen-and-paper':
            case 'typed':
                this.setState({
                    inputType: event.target.value
                })
                break;
            default: 
                break;
        }
    }

    handleSubmit(event){
        event.preventDefault()
        if (this.state.roomName == '' || this.state.category == '' || this.state.inputType == ''){
            alert('Please input valid information')
        }
        else{
            this.props.socket.emit('create room', {roomName: this.state.roomName, categories: [this.state.category], inputType: this.state.inputType, usersInRoom: []});
        }


    }


    render() {
        //Checks if user is logged in in sessionStorage
        if (sessionStorage.getItem('username') == null){
            return (<Redirect to='/' />)
        }
        //TODO ADD AND DELETE MULTIPLE CATEGORIES
        return (
            <div className='create-room-wrapper'>
                <form id="create-room" onSubmit={this.handleSubmit}>
                    <label htmlFor="room-name">Room name:</label><br/>
                    <input type="text" id="room-name" name="room-name" value={this.state.roomName} onChange={this.handleChange} /><br/>
                    
                    <label htmlFor="add-category">Add a category:</label><br/>
                    <input type="text" id="add-category" name="add-category"  value={this.state.category} onChange={this.handleChange}/><br/>
                    
                    <label htmlFor="input-type">Input type:</label><br/>
                    <input type="radio" id="pen-and-paper" name="input-type" value="pen-and-paper" checked={this.state.inputType === 'pen-and-paper'} onChange={this.handleChange}/>
                    <label htmlFor="pen-and-paper">Pen & Paper</label><br/>
                    <input type="radio" id="typed" name="input-type" value="typed" checked={this.state.inputType === 'typed'} onChange={this.handleChange}/>
                    <label htmlFor="typed">Typed</label><br/>
                    <input type="submit" value="Create Room" />
                </form>

            </div>
        )
    }
}
