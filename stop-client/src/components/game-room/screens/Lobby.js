import React, { Component } from 'react';
import '../styling/Lobby.css';
import LetterDisplay from '../LetterDisplay.js';
import ReadyStopButton from '../ReadyStopButton.js'

export default class Lobby extends Component {
    constructor(props){
        super(props)
    }
    render() {

        return (

            <div className='lobby-canvas'>
                <LetterDisplay />
                <h4 className='user-instructions'>Press Ready to Begin.</h4>
                <ReadyStopButton />
            </div>

        )
    }
}
