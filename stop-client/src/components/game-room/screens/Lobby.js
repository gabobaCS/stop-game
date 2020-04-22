import React, { Component } from 'react';
import '../styling/Lobby.css';
import LetterDisplay from '../LetterDisplay.js';
import ReadyStopButton from '../ReadyStopButton.js';
import GameTyped from './GameTyped.js'

export default class Lobby extends Component {
    constructor(props){
        super(props);
        this.handleReadyButton = this.handleReadyButton.bind(this);
        this.state = {
            userReady: false,
            currentGameState:''

        }
    }
    componentDidUpdate(prevProps){
        if (prevProps != this.props){
            console.log(this.props)
            console.log(this.props)
            if (this.props.roomData.gameState == 'lobby'){
                this.setState({
                    currentGameState: 'lobby'
                })
            }
            if (this.props.roomData.gameState == 'gameInProgress'){
                this.setState({
                    currentGameState: 'gameInProgress'
                })
            }
        }
    }

    handleReadyButton(){
        this.setState({
            userReady: true 
        })
        console.log('User ready')
        this.props.socket.emit('player ready', {username:sessionStorage.username, roomName:sessionStorage.room})
    }
    render() {
        let screen;
    switch(this.state.currentGameState){
        case 'lobby':
           this.state.userReady ? screen = (<h4 className='user-instructions'>Waiting for other players...</h4>) : screen = (<h4 className='user-instructions'>Press Ready to Begin.</h4>);
           break
        case 'gameInProgress':
            console.log(this.props)
            if (this.props.roomData.inputType == 'typed'){
                screen = <GameTyped />
            }
            else if (this.props.roomData.inputType == 'pen-and-paper'){
                screen = 'game in progress'
            }

    }
        return (

            <div className='lobby-canvas'>
                <LetterDisplay />
                {screen}
                <ReadyStopButton userReady={this.state.userReady} currentGameState={this.state.currentGameState} handleClick={() => this.handleReadyButton}/>

            </div>

        )
    }
}
