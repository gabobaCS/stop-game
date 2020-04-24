import React, { Component } from 'react';
import '../styling/GameTyped.css';

export default class GameTyped extends Component {
    constructor(props){
        super(props)
        this.formatList = this.formatList.bind(this);
        this.handleChange = this.handleChange.bind(this);
        function formatState(arrayOfCategories){
            let formattedState = {}
            arrayOfCategories.forEach((category) => {
                formattedState[category] = ''
            })
            return formattedState;
        }
        this.state = {
            categories: formatState(this.props.roomData.categories)
        }
    }

    componentDidMount(){
        this.props.socket.on('handle stop', () => {
            console.log(this.props)
            console.log(this.state.categories)
            this.props.socket.emit('stop data', {categories: this.state.categories, username: sessionStorage.getItem('username')})
        })

    }


    formatList(arrayOfCategories){
        let pairedCategories = [[]];
        for (let i = 0; i < arrayOfCategories.length; i++){
            if (pairedCategories[pairedCategories.length - 1].length == 2 ) {
                pairedCategories.push([arrayOfCategories[i]])
            }
            else if (pairedCategories[pairedCategories.length - 1].length == 1 || pairedCategories[pairedCategories.length - 1].length == 0){
                pairedCategories[pairedCategories.length - 1].push(arrayOfCategories[i])
            }
        }
        let formattedCategories = [];
        for (let i = 0; i < pairedCategories.length; i++){
            let divLi;
            if (i != pairedCategories.length - 1 || pairedCategories[pairedCategories.length - 1].length != 1){
                divLi = (
                <div key={i} className='categories-li-pairs'>
                    <li key={pairedCategories[i][0]}>
                        <div className='category-label-wrapper'>
                        <label htmlFor={pairedCategories[i][0]}>{pairedCategories[i][0]}:</label><br />
                        </div>
                        <input type="text" id={pairedCategories[i][0]} value={this.state.categories[pairedCategories[i][0]]} onChange={this.handleChange} className="category" name={pairedCategories[i][0]}></input>  
                    </li>
                    <div className='spacer'/>
                    <li key={pairedCategories[i][1]}>
                        <div className='category-label-wrapper'>
                        <label htmlFor={pairedCategories[i][1]}>{pairedCategories[i][1]}:</label><br />
                        </div>
                        <input type="text" id={pairedCategories[i][1]}  value={this.state.categories[pairedCategories[i][1]]} onChange={this.handleChange} className="category" name={pairedCategories[i][1]}></input>  
                    </li>
                </div>
                )
                formattedCategories.push(divLi)
            }
            else{
                divLi = (
                    <div key={i} className='categories-li-pairs'>
                        <li key={pairedCategories[i][0]}>
                            <div className='category-label-wrapper'>
                            <label htmlFor={pairedCategories[i][0]}>{pairedCategories[i][0]}:</label><br />
                            </div>
                            <input type="text" id={pairedCategories[i][0]} value={this.state.categories[pairedCategories[i][0]]} onChange={this.handleChange} className="category" name={pairedCategories[i][0]}></input>  
                        </li>
                    </div>
                )
                formattedCategories.push(divLi)
            }
        }
        return formattedCategories 
    }

    handleChange(event){
        let categories = this.state.categories
        categories[event.target.id] = event.target.value
        this.setState({
            'categories': categories 
        })
    }
    render() {
        const formattedList = this.formatList(this.props.roomData.categories);
        return (
            <div className='categories-wrapper'>
               <form id='categories-form' >
                    <ul className='categories-ul'>
                        {formattedList}
                    </ul>
                </form>

            </div>



        )
    }
}
