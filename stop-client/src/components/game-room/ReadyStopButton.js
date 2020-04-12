import React, { Component } from 'react';
import './styling/ReadyStopButton.css';
import ReadyButtonSVG from '../../assets/ready-button.svg';
import ReadyButtonActiveSVG from '../../assets/ready-button-active.svg';

export default class ReadyStopButton extends Component {
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            active: false
        }
    }
    handleClick(){
        this.setState({
            active: true
        })
    }
    render() {
        return (
            <div>
                <img className='ready-stop-button-svg ready-button-svg' style={(!this.state.active)?{display:''}:{display:'none'}} src={ReadyButtonSVG} alt="Ready"  onClick={this.handleClick}/>
                <img className='ready-stop-button-svg ready-button-active-svg' src={ReadyButtonActiveSVG} style={(this.state.active)?{display:''}:{display:'none'}} alt="Ready" />
            </div>
        )
    }
}
