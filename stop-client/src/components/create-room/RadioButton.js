import React, { Component } from 'react'
import './RadioButton.css'

export default class RadioButton extends Component {
    constructor(props){
        super(props)
    }

    handleClick(){
        console.log('heredsddd')
    }


    render() {
        const style = (this.props.isChecked) ? {background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,238,0,1) 100%)', borderColor: ' rgb(141, 151, 0)'}: 
        {background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(223,223,223,1) 100%)', borderColor: 'rgb(112, 112, 112)'}

        return (
            <div className='radio-button'>
                <div className='button' style={style}></div>
                <label  htmlFor="pen-and-paper">{this.props.text}</label><br/>
            </div>
        )
    }
}
