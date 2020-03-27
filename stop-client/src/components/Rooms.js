import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';

export default class Rooms extends Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        //Handles user getting into the route directly while already logged in in client
  /*       console.log(this.props.location) */
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
