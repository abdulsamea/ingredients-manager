import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm = React.memo(props => {
  // use state can be a var, bool, object, array etc whereas is class based component state is always object.
  // can use a single state which makes difficult for managing if there are 100s of state variable
  
  // const [ inputState, setInputState ] = useState({ title: '', amount: '' });
  
  const [ enteredTitle, setEnteredTitle ] = useState('');
  const [ enteredAmount, setEnteredAmount ] = useState('');

  const submitHandler = event => {
    event.preventDefault();
   props.onAddIngredient({title: enteredTitle,  amount: enteredAmount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input 
              type="text" 
              id="title" 
              value={ enteredTitle }
              onChange={ event => { 
                setEnteredTitle(event.target.value)     
              }} 
              />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input 
              type="number" 
              id="amount" 
              value={ enteredAmount }  
              onChange={ event => { 
                setEnteredAmount(event.target.value)
              }} 
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator/> }
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
