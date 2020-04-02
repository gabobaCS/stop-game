import React, { Component } from 'react';
import './Home.css'
import CreateRoomButtonSVG from '../../assets/create-room-button.svg';
import JoinARoomButtonSVG from '../../assets/join-a-room-button.svg';
import ModalLogin from './ModalLogin.js'

export default class Home extends Component {
    render() {
        return (
            <React.Fragment>
                <ModalLogin isUserLoggedIn={false} />
                <h1>STOP Online</h1>
                <div id='create-room-button-wrapper'>
                    <img src={CreateRoomButtonSVG} alt="Create Room" />
                        <div className='spacer'></div>
                    <img src={JoinARoomButtonSVG} alt="Join a Room" />
                </div>
            </React.Fragment>

        )
    }
}
