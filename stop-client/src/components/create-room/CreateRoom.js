import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import './CreateRoom.css'
import RadioButton from './RadioButton.js';
import ModalDeleteCategory from './ModalDeleteCategory.js';
import Cross from '../Cross.js';
import WarningModal from '../WarningModal.js';

export default class CreateRoom extends Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleAddCategory = this.handleAddCategory.bind(this);
        this.formatCategories = this.formatCategories.bind(this);
        this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleWarningModal = this.handleWarningModal.bind(this);
        this.state = {
            roomName: '',
            category: '',
            categoriesList: [],
            inputType: '',
            displayModal: false,
            displayWarningModal: {'display': false, 'message': ''},
            targetCategory: ''
        }
    }

    componentDidMount(){
        //Attempts user login if there's a sessionStorage active but it has refreshed the page or accessed it directly.
        if (sessionStorage.getItem('username') != null && sessionStorage.getItem('id') != this.props.socket.id){
            console.log('theres a username but not redirected')
            this.props.socket.emit('try login', sessionStorage.getItem('username'))
        }
        //Updates sessionStorage on succesful login.
        this.props.socket.on('succesful login', (username) => {
            console.log('logged: ' + username);
            //Adds user to sessionStorage
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('room', null);
            sessionStorage.setItem('id', this.props.socket.id);
        })
        //Redirects on unsuccesful login
        this.props.socket.on('username already in use', () => {
            this.props.history.push('/')
        })        
        //Automatically unjoins user from any room on reaching page, after checking that user is connected.
        if (sessionStorage.getItem('username') != null && sessionStorage.getItem('room') != null){
            console.log('should leave room')
            this.props.socket.emit('leave room', {username: sessionStorage.getItem('username'), room: sessionStorage.getItem('room'), id:sessionStorage.getItem('id')});
            //Handles duplicate messages in room by removing listener.
            this.props.socket.removeAllListeners('succesful room join')
            sessionStorage.setItem('room', null)
        }

        
        //Redirects on room created succesfully.
        this.props.socket.on('room created succesfully', () => {
            this.props.history.push('/rooms');
        })
        //Handles invalid room name.
        this.props.socket.on('invalid room', () => {
            this.setState({
                displayWarningModal: {display: true, message: 'Room name taken'}
            })
        })
    }

    handleChange(event){ 
        //Passes html form to component's state
        switch(event.target.id){
            case 'room-name':
                let noSpaceRoomName = event.target.value.replace(/\s/g, "");
                if (noSpaceRoomName.length < 20){
                    this.setState({
                        roomName: noSpaceRoomName.toUpperCase()
                    })
                }
                break
            case 'add-category':
                let noSpaceCategory = event.target.value.replace(/\s/g, "");
                if (noSpaceCategory.length < 16){
                    this.setState({
                        category: noSpaceCategory.toUpperCase()
                    })
                }
                break;
        }
    }

    handleSubmit(event){
        event.preventDefault()
        //Handles invalid input.
        if (this.state.roomName == '' || this.state.categoriesList.length == 0 || this.state.inputType == ''){
            this.setState({
                displayWarningModal: {display: true, message: 'Please fill all fields'}
            })
        }
        else{
            this.props.socket.emit('create room', {roomName: this.state.roomName, categories: this.state.categoriesList, inputType: this.state.inputType, usersInRoom: [], gameState:'lobby'});
        }
    }

    handleClick(input){
        console.log(input)
        this.setState({
            inputType: input
        })
    }

    handleAddCategory(){
        if (this.state.category != ''){
            if (!this.state.categoriesList.includes(this.state.category)){
                this.setState({
                    categoriesList: this.state.categoriesList.concat([this.state.category]),
                    category: ''
                })
            }
            else{
                this.setState({
                    displayWarningModal: {'display': true, 'message':'Category already added'}
                })
            }

        }
    }

    formatCategories(categoriesArray){
        //Formats list of string to dynamic JSX. It lists 3 item per row, unless the items would cause x-overflow.
        let formattedList = [];
        let buffer = [];
        let letterCounter = 0;
        for (let i = 0; i < categoriesArray.length; i++){
            if (letterCounter + categoriesArray[i].length > 19){
                formattedList.push(<ul  key={categoriesArray[i]} className='categories-list-form'>{buffer}</ul>);
                buffer = [<li onClick={() => this.handleDeleteCategory('open-modal', categoriesArray[i])} key={categoriesArray[i]}>{categoriesArray[i]}</li>];
                letterCounter = categoriesArray[i].length;
            }
            else{
                buffer.push(<li onClick={() => this.handleDeleteCategory('open-modal', categoriesArray[i])} key={categoriesArray[i]}>{categoriesArray[i]}</li>);
                letterCounter += categoriesArray[i].length;
            }
            
            if (buffer.length == 3){
                formattedList.push(<ul key={categoriesArray[i]} className='categories-list-form'>{buffer}</ul>);
                letterCounter = 0;
                buffer = [];
            }
        }
        if (buffer.length != 0){
            formattedList.push(<ul key='randomKEY' className='categories-list-form'>{buffer}</ul>)
        }
        return formattedList
    }

    handleDeleteCategory(answer, target){
        if (answer == 'close'){
            this.setState({
                displayModal: false
            })
        }
        if (answer == 'delete-category'){
            console.log(this.state.targetCategory)
            const targetIndex = this.state.categoriesList.indexOf(this.state.targetCategory)
            this.setState({
                categoriesList: [...this.state.categoriesList.slice(0, targetIndex), ...this.state.categoriesList.slice(targetIndex + 1)],
                displayModal: false
            })
        }
        if (answer == 'open-modal'){
            this.setState({
                displayModal: true,
                targetCategory: target

            })
        }
    }

    handleWarningModal(){
        console.log('here')
        this.setState({
            displayWarningModal: {display: false, message: ''}
        })
    }
    
    handleKeyPress(event){
        if (event.key === 'Enter'){
            event.preventDefault();
            this.handleAddCategory();
        }
    }




    render() {
        //Checks if user is logged in in sessionStorage
        if (sessionStorage.getItem('username') == null){
            return (<Redirect to='/' />)
        }

        return (
            <React.Fragment>
                <WarningModal message={this.state.displayWarningModal.message} display={this.state.displayWarningModal.display}  handleWarningModal={this.handleWarningModal.bind(this)}/>
                <ModalDeleteCategory display={this.state.displayModal} handleDeleteCategory={this.handleDeleteCategory.bind(this)}/>
                <div className='canvas-wrapper'>
                    <h2 className='title'>Create Room</h2>
                    <div onClick={() => this.props.history.push('/')}>
                        <Cross />
                    </div>

                    <form id="create-room-form" onSubmit={this.handleSubmit} >
                        <div className='room-name'>
                            <label htmlFor="room-name" className='high-level-label'>Room name:</label><br/>
                            <input type="text" id="room-name" name="room-name" value={this.state.roomName} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} onChange={this.handleChange} /><br/>
                        </div>                       
                        
                        <div className='create-room-flex'>
                            <div className='add-category'>
                                <label className='high-level-label' htmlFor="add-category">Add a category:</label><br/>
                                <div className='add-category-input'>
                                    <input className='add-category-text' type="text" id="add-category" name="add-category" value={this.state.category} onKeyPress={this.handleKeyPress} onChange={this.handleChange}/>
                                    <span onClick={this.handleAddCategory} className='add-category-button'>+</span>
                                </div> 

                                <div className='categories-list-wrapper'>
                                    {this.formatCategories(this.state.categoriesList)}
                                </div>        

                            </div>
                            <div className='spacer'/>
                            <div>
                                <label id='input-type-label' className='high-level-label' htmlFor="input-type">Input type:
                                </label><br/>
                                <div onClick={()=>this.handleClick('pen-and-paper')}><RadioButton isChecked={(this.state.inputType == 'pen-and-paper' ? true : false)} text='PEN & PAPER'/></div>
                                <div onClick={()=>this.handleClick('typed')}><RadioButton isChecked={(this.state.inputType == 'typed' ? true : false)} text='TYPED'/></div>
                            </div>
                        </div>

                        <div className='button-holder'>
                            <input id='create-room-button' className='submit-button' type="submit" value="Create" />
                        </div>

                    </form>
                </div>          
            </React.Fragment>
        )
    }
}
