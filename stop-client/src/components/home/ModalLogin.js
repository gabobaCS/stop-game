import React, { Component } from 'react'
import './ModalLogin.css'

export default class ModalLogin extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            username: '',
            formSubmitted: false
        }
    }

    handleChange(event){
        this.setState({username: event.target.value});
    }

    handleSubmit(event){
        this.setState({
            formSubmitted: true
        })
        event.preventDefault()
    }
    render() {
        let style = (this.props.isUserLoggedIn == false && this.state.formSubmitted == false) ? {display: ''} : {display:'none'}
        return (
            <div id='modal-login' style={style}>
                <div className='modal-login-canvas modal-transition' >
                    <h2>Enter your username</h2>
                    <form className='modal-login-form' onSubmit={this.handleSubmit} >
                        <input type="text" value={this.state.username} onChange={this.handleChange} />
                        <div className='button-wrapper-align'>
                            <input type="submit" className='submit-button' value="Sign In" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
