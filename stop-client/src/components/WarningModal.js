import React, { Component } from 'react';
import ModalCrossSVG from '../assets/modal-cross.svg';
import './WarningModal.css'

export default class WarningModal extends Component {
    render() {
        return (
            <div className='modal' style={(this.props.display) ? {display: ''}:{display: 'none'}}>
                <div className='closing-modal'  onClick={() => this.props.handleWarningModal()} ></div> 
                <div className='modal-canvas modal-category-transition' >
                    <div className='modal-cross'><img src={ModalCrossSVG} className='modal-cross-svg' alt="Cross" onClick={() => this.props.handleWarningModal()}/></div>
                    <h2>{this.props.message}</h2>
                    <div className='modal-warning-category-flex'>
                        <div className='submit-button ok-button' onClick={() => this.props.handleWarningModal()}>OK</div>
                    </div>
                </div>
            </div>
        )
    }
}
