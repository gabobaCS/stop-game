import React, { Component } from 'react';
import './styling/UsersData.css';

export default class UsersData extends Component {
    render() {
        return (
            <div className='user-data'>
                <ul>
                    <li>
                        <h4>Gabo</h4>
                        <h5>235 pts</h5>
                        <hr />
                    </li>
                    <li>
                        <h4>Bernie</h4>
                        <h5>125 pts</h5>
                        <hr />
                    </li>
                    <li>
                        <h4>Meagan</h4>
                        <h5>55 pts</h5>
                        <hr />
                    </li>


                </ul>
            </div>
        )
    }
}
