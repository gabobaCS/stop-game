import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import './CreateRoom.css'
import RadioButton from './RadioButton.js';
import Cross from '../Cross.js'

export default class CreateRoom extends Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
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

    handleClick(input){
        this.setState({
            inputType: input
        })
    }


    render() {
        //Checks if user is logged in in sessionStorage
        if (sessionStorage.getItem('username') == null){
            return (<Redirect to='/' />)
        }
        //TODO ADD AND DELETE MULTIPLE CATEGORIES
        return (
            <React.Fragment>
                <div className='canvas-wrapper'>
                    <h2 className='title'>Create Room</h2>
                    <Cross />
                    <form id="create-room-form" onSubmit={this.handleSubmit}>
                        <div className='room-name'>
                            <label htmlFor="room-name" className='high-level-label'>Room name:</label><br/>
                            <input type="text" id="room-name" name="room-name" value={this.state.roomName} onChange={this.handleChange} /><br/>
                        </div>                       
                        
                        <div className='create-room-flex'>
                            <div className='add-category'>
                                <label className='high-level-label' htmlFor="add-category">Add a category:</label><br/>
                                <div className='add-category-input'>
                                    <input className='add-category-text' type="text" id="add-category" name="add-category"  value={this.state.category} onChange={this.handleChange}/>
                                    <span className='add-category-button'>+</span>
                                </div>                             
                            </div>
                            <div className='spacer'/>
                            <div>
                                <label id='input-type-label' className='high-level-label' htmlFor="input-type">Input type:
                                </label><br/>
                                <div onClick={()=>this.handleClick('pen-and-paper')}><RadioButton isChecked={(this.state.inputType == 'pen-and-paper' ? true : false)} text='PEN & PAPER'/></div>
                                <div onClick={()=>this.handleClick('typed')}><RadioButton isChecked={(this.state.inputType == 'typed' ? true : false)} text='TYPED'/></div>
                            </div>
                        </div>
                        <div className='button-holder'>
                            <input className='submit-button create-room-button' type="submit" value="Create" />
                        </div>

                    </form>
                </div>          
            </React.Fragment>
        )
    }
}
