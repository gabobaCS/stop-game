import React, { Component } from 'react';
import CrossSVG from '../assets/cross.svg';
import './Cross.css'

export default class Cross extends Component {
    render() {
        return (
            <div className='close-button'><img className='cross-svg' src={CrossSVG} alt="Cross" /></div>
        )
    }
}
