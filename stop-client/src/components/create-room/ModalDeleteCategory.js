import React, { Component } from 'react';
import ModalCrossSVG from '../../assets/modal-cross.svg';

import './ModalDeleteCategory.css';

export default class ModalDeleteCategory extends Component {
    render() {
        return (
            <div className='modal' style={(this.props.display) ? {display: ''}:{display: 'none'}}>
                <div className='closing-modal'  onClick={() => this.props.handleDeleteCategory('close')}></div> 
                <div className='modal-canvas modal-category-transition' >
                    <div className='modal-cross'><img src={ModalCrossSVG} className='modal-cross-svg' alt="Cross" onClick={() => this.props.handleDeleteCategory('close')}/></div>
                    <h2>Do you want to<br/>delete this category?</h2>
                    <div className='modal-category-flex'>
                        <div className='submit-button yes-button' onClick={() => this.props.handleDeleteCategory('delete-category')}>Yes</div>
                        <div className='modal-category-spacer'></div>
                        <div className='submit-button no-button' onClick={() => this.props.handleDeleteCategory('close')} >No</div>
                    </div>

                </div>
            </div>
        )
    }
}
