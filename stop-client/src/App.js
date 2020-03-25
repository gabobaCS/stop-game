import React, { Component } from 'react'
import CreateRoom from './CreateRoom.js'
import Room from './Room.js'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
  } from "react-router-dom";

export default class App extends Component {
    constructor(props){
        super(props)
    }
    render() {
        console.log('props'+this.props)
        return (
            <Router>
                <Route exact path='/' component={CreateRoom}/>
                <Route path='/room/:name' component={Room}/>
            </Router>

        )
    }
}
