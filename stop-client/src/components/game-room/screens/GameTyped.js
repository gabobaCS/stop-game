import React, { Component } from 'react';
import '../styling/GameTyped.css';

export default class GameTyped extends Component {
    constructor(props){
        super(props)
        this.formatList = this.formatList.bind(this)
    }
    formatList(arrayOfCategories){

    }

    render() {
        console.log(this.props)
        return (
            <div className='categories-wrapper'>
               <form id='categories-form'>
                    <ul className='categories-ul'>
                        <div className='categories-li-pairs'>
                            <li>
                                <div className='category-label-wrapper'>
                                <label htmlFor="fruit">Fruit:</label><br />
                                </div>
                                <input type="text" id="fruit" className="category" name="fruit"></input>  
                            </li>
                            <div className='spacer'/>
                            <li>
                                <div className='category-label-wrapper'>
                                <label htmlFor="fruit">Country:</label><br />
                                </div>
                                <input type="text" id="fruit" className="category" name="fruit"></input>  
                            </li>
                        </div>
                        <div className='categories-li-pairs'>
                            <li>
                                <div className='category-label-wrapper'>
                                <label htmlFor="fruit">Animal:</label><br />
                                </div>
                                <input type="text" id="fruit" className="category" name="fruit"></input>  
                            </li>
                            <div className='spacer'/>
                            <li>
                                <div className='category-label-wrapper'>
                                <label htmlFor="fruit">City:</label><br />
                                </div>
                                <input type="text" id="fruit" className="category" name="fruit"></input>  
                            </li>
                        </div>
                        <div className='categories-li-pairs'>
                            <li>
                                <div className='category-label-wrapper'>
                                <label htmlFor="fruit">Animal:</label><br />
                                </div>
                                <input type="text" id="fruit" className="category" name="fruit"></input>  
                            </li>
                            <div className='spacer'/>
                            <li>
                                <div className='category-label-wrapper'>
                                <label htmlFor="fruit">City:</label><br />
                                </div>
                                <input type="text" id="fruit" className="category" name="fruit"></input>  
                            </li>
                        </div>
                        <div className='categories-li-pairs'>
                            <li>
                                <div className='category-label-wrapper'>
                                <label htmlFor="fruit">Animal:</label><br />
                                </div>
                                <input type="text" id="fruit" className="category" name="fruit"></input>  
                            </li>
                            <div className='spacer'/>
                            <li>
                                <div className='category-label-wrapper'>
                                <label htmlFor="fruit">City:</label><br />
                                </div>
                                <input type="text" id="fruit" className="category" name="fruit"></input>  
                            </li>
                        </div>


                    </ul>
                </form>

            </div>



        )
    }
}
