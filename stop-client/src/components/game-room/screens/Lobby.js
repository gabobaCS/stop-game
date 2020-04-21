import React, { Component } from 'react';
import '../styling/Lobby.css';
import LetterDisplay from '../LetterDisplay.js';
import ReadyStopButton from '../ReadyStopButton.js'

export default class Lobby extends Component {
    constructor(props){
        super(props);
        this.handleReadyButton = this.handleReadyButton.bind(this);
        this.state = {
            userReady: false,
            // currentGameState:'lobby'

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
            screen = 'game in progress'
    }
        return (

            <div className='lobby-canvas'>
                <LetterDisplay />
                {screen}
                <ReadyStopButton userReady={this.state.userReady} handleClick={() => this.handleReadyButton}/>

            </div>

        )
    }
}
