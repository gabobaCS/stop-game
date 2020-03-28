import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

export default class Rooms extends Component {
    constructor(props){
        super(props)
        this.state = {
            redirected: false
        }
    }

    componentDidMount(){
        //Handles user getting into the route directly by comparing Socket ID
        if (sessionStorage.getItem('id') == this.props.socket.id){
            console.log('same session')
        }
        else{
            console.log('not same session')
        }
        //Attemps user login if there's a sessionStorage active but it has refreshed the page or accessed it directly
        if (sessionStorage.getItem('username') != null && sessionStorage.getItem('id') != this.props.socket.id){
            console.log('theres a username but not redirected')
            this.props.socket.emit('try login', sessionStorage.getItem('username'))
        }

        this.props.socket.on('succesful login', (username) => {
            console.log('logged: ' + username);
            //Adds user to sessionStorage
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('room', null);
            sessionStorage.setItem('id', this.props.socket.id);
        })

        this.props.socket.on('username already in use', () => {
            this.props.history.push('/')
        }) 
    }

    render(){
        //Checks if user is logged in in sessionStorage
        if (sessionStorage.getItem('username') == null){
            return (<Redirect to='/' />)
        }
        return (
            <div>
                ff
            </div>
        )
    }
}
