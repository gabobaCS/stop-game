import React, { Component } from 'react';
import '../styling/Lobby.css';
import LetterDisplay from '../LetterDisplay.js';
import ReadyStopButton from '../ReadyStopButton.js';
import GameTyped from './GameTyped.js';
import Stop from './Stop.js';

export default class Lobby extends Component {
    constructor(props){
        super(props);
        this.handleReadyButton = this.handleReadyButton.bind(this);
        this.state = {
            userReady: false,
            currentGameState:''

        }
    }
    componentDidMount(){
        this.props.socket.on('handle stop', () => {
            this.setState({
                currentGameState: 'stop',
                userReady: false
            })
        })
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

    handleReadyButton(action){
        if (action == 'player ready'){
            this.setState({
                userReady: true 
            })
            console.log('User ready')
            this.props.socket.emit('player ready', {username:sessionStorage.username, roomName:sessionStorage.room})
        }
        if (action == 'stop'){
            console.log('stop request will be emitted')
            this.props.socket.emit('stop request', this.props.roomData.roomName)
        }

    }
    render() {
        let screen;
    switch(this.state.currentGameState){
        case 'lobby':
           this.state.userReady ? screen = (<h4 className='user-instructions'>Waiting for other players...</h4>) : screen = (<h4 className='user-instructions'>Press Ready to Begin.</h4>);
           break
        case 'gameInProgress':
            if (this.props.roomData.inputType == 'typed'){
                screen = <GameTyped roomData={this.props.roomData} socket={this.props.socket}/>
            }
            else if (this.props.roomData.inputType == 'pen-and-paper'){
                screen = 'game in progress'
            }
            break
        case 'stop':
            screen = <Stop />

    }
        return (

            <div className='lobby-canvas'>
                <LetterDisplay />
                {screen}
                <ReadyStopButton userReady={this.state.userReady} currentGameState={this.state.currentGameState} handleReadyButton={(action) => this.handleReadyButton(action)}/>

            </div>

        )
    }
}
