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

        if (sessionStorage.getItem('username') != null && sessionStorage.getItem('id') != this.props.socket.id){
            console.log('theres a username but not redirected')
            this.props.socket.emit('try login', sessionStorage.getItem('username'))
        }

        this.props.socket.on('succesful login', (username) => {
        console.log('logged: ' + username)
        })

        this.props.socket.on('username already in use', () => {
            
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
