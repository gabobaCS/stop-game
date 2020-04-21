import React, { Component } from 'react';
import './styling/UsersData.css';

export default class UsersData extends Component {
    render() {
        let usersList = []
console.log(this.props)
        if (this.props.dataReceived){

            usersList = this.props.usersInRoom.map((userObject) => {
                return (
                    <li key={userObject.username}>
                        <h4 style={userObject.playerReady ? {color: 'white'}:{color: '#FF6060'}} >{userObject.username}</h4>
                        <h5>{userObject.points} pts</h5>
                        <hr />
                    </li>
                )
            });
        }

        console.log(usersList)
        return (
            <div className='user-data'>
                <ul>
                    {usersList}
                </ul>
            </div>
        )
    }
}
