import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

// ingredient reducer
const ingredientReducer = (currentIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      // override current currentIngredients and add new ingredient 
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there !');
  }
}

// http reducer 

const httpReducer = (curHttpState, action) => {
  switch(action.type){
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return {...curHttpState, loading: false};
    case 'ERROR':
      return {loading: false, error: action.errorMessage };
    case 'CLEAR':
      return {...curHttpState, error: null};
    default:
      throw new Error('should not be reached !');
  }
}

const  Ingredients = () => {
  
  const [ingredients, dispatchIngredient] = useReducer(ingredientReducer, []);
  // const [ingredients, setIngredients] = useState([]);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error:null })
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  // we can have multiple useEffect in  a component
  
/*  useEffect(() => {
    fetch('https://react-hooks-update-98248.firebaseio.com/ingredients.json')
    .then(response =>  response.json() )
    .then(responseData => {
    const loadedIngredients = [];
    for(const key in responseData){
      loadedIngredients.push({
        id: key,
        title: responseData[key].title,
        amount: responseData[key].amount
      });
    }
    setIngredients(loadedIngredients);
  })
  }, []);
  */
  // [] adding [] as seconf argument, makes useEffect to work like componentDidMount, executng it onyl once instead
  // of every render cycle i.e infiinte loop
  // [] contains dependencies which when provided inside this array makes useEffect to execute when those 
  // dependencies / variables change

  

  const addIngredientHandler = useCallback(ingredient => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'});
    fetch('https://react-hooks-update-98248.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      // setIsLoading(false);
      dispatchHttp({type: 'RESPONSE'});
      return response.json();
    }).then(responseData => {
      // setIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient } 
      //   ])

      dispatchIngredient({type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })

    }).catch(err => {
      // setError('Something went wrong !');
      // setIsLoading(false);
      dispatchHttp({type: 'ERROR',  errorMessage: 'Something went wrong!' });
    })
  }, [])

  const removeIngredientHandler =useCallback( ingId => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'});
    fetch(`https://react-hooks-update-98248.firebaseio.com/ingredients/${ingId}.json`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      // setIsLoading(false);
      // const updatedIngredients = ingredients.filter(ingredient => ingredient.id !== ingId) 
      // setIngredients(updatedIngredients);
      dispatchIngredient({type: 'DELETE', id: ingId})
      dispatchHttp({type: 'RESPONSE'});
    }).catch(err => {
      dispatchHttp({type: 'ERROR',  errorMessage: 'Something went wrong!' });
      // setError('Something went wrong !');
      // setIsLoading(false);
    })
  }, [])

  // useCallback is not fired on every render of component.
  const filteredIngredientsHandler = useCallback( filteredIngredients => {
    // setIngredients(filteredIngredients);
    dispatchIngredient({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const clearError = useCallback(() =>{
    // setError(null);
    dispatchHttp({ type: 'CLEAR' });
  }, [])

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients = {ingredients} onRemoveItem={removeIngredientHandler} />
    );
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{ httpState.error }</ErrorModal>}

      <IngredientForm 
      onAddIngredient={ addIngredientHandler } 
      loading={ httpState.loading }
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}  />
       {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
