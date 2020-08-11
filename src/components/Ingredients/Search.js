import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter ] = useState('');
  const inputRef =  useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      // setTimeout waits for 500 ms and check if last input(last value of enteredFilter) === current latest input value in search
      // if true than go for search api
      // this is done to avoid spamming server with hits from each keystroke
      // we only go for search api if user waits for a few ms and leaves the search bar typing.
      
      if (enteredFilter === inputRef.current.value){
        const query = enteredFilter.length === 0 ? '' :  `orderBy="title"&equalTo="${enteredFilter}"`;
        fetch('https://react-hooks-update-98248.firebaseio.com/ingredients.json?' + query)
        .then(response =>  response.json())
        .then(responseData => {
        const loadedIngredients = [];
        for(const key in responseData){
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        }
          onLoadIngredients(loadedIngredients)
        })
      }

      // use clean up function to dlt old timer when new timer rnus after each rerender
      // dependencies are loaded only once but cleanup function areloaded before each mounting of component
      // cleanup fn is written in last of useEffect as a return
      return () => {
        clearTimeout(timer);
      }
    }, 500);
    // not necessary to include inputRef in dependencies.
  }, [enteredFilter, onLoadIngredients, inputRef])

  return (  
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            ref={inputRef}
            type="text" 
            value={enteredFilter} 
            onChange={event => setEnteredFilter(event.target.value) } 
          />

        </div>
      </Card>
    </section>
  );
});

export default Search;
