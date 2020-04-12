import React, { Component } from 'react';
import './styling/LetterDisplay.css';

export default class LetterDisplay extends Component {

    render() {
        return (
            <div className='letter-square-wrapper'>
                <div className='letter-square'>
                    <h4 className='letter'>A</h4>              
                </div>
            </div>

        )
    }
}
