import React, { Component } from 'react';
import '../styling/Stop.css';
import StopSign from '../../../assets/stop-sign-hand.svg';

export default class GameTyped extends Component {
    render() {
        return (
            <div className='stop-canvas'>
                <img className='stop-animation' src={StopSign} alt="Stop"/>
                    
                <h3 className='stop-text'>STOP!</h3>
                <h4 className='stop-user-instructions'>Press Ready for Next Round.</h4>


            </div>



        )
    }
}
