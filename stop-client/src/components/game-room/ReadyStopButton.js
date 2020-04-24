import React, { Component } from 'react';
import './styling/ReadyStopButton.css';
import ReadyButtonSVG from '../../assets/ready-button.svg';
import ReadyButtonActiveSVG from '../../assets/ready-button-active.svg';
import StopButtonSVG from '../../assets/stop-button.svg';
export default class ReadyStopButton extends Component {
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            active: false
        }
    }
    handleClick(action){
        console.log(action)
        this.props.handleReadyButton(action)
    
    }
    render() {
        let button;
        if (this.props.currentGameState == 'lobby' || this.props.currentGameState == '' ){
            button= (
                <div>
                    <img className='ready-stop-button-svg ready-button-svg' style={(!this.props.userReady)?{display:''}:{display:'none'}} src={ReadyButtonSVG} alt="Ready"  onClick={() => this.handleClick('player ready')}/>
                    <img className='ready-stop-button-svg ready-button-active-svg' src={ReadyButtonActiveSVG} style={(this.props.userReady)?{display:''}:{display:'none'}} alt="Ready" />
                </div>
            )
        }
        else if (this.props.currentGameState == 'gameInProgress'){
            button = (
                <div>
                    <img className='ready-stop-button-svg ready-button-svg' src={StopButtonSVG} alt="Ready"  onClick={() => this.handleClick('stop')}/>
                </div>
            )
        }
        return (
            <React.Fragment>
            {button}

            </React.Fragment>

        )
    }
}
