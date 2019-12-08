import React, { useReducer, useEffect } from 'react';
import '../App.css';
import Header from './Header';
import Movie from './Movie';
import Search from './Search';

const API_KEY = process.env.REACT_APP_API_KEY;

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SEARCH_MOVIE_REQUEST':
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case 'SEARCH_MOVIE_SUCCESS':
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case 'SEARCH_MOVIE_FAILURE':
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?s=man&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(json => {
      dispatch({
        type: 'SEARCH_MOVIE_SUCCESS',
        payload: json.Search
      });
    });
  }, []);

  const search = searchValue => {
    dispatch({
      type: 'SEARCH_MOVIE_REQUEST'
    });

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(json => {
      if (json.Response === 'True') {
        dispatch({
          type: 'SEARCH_MOVIE_SUCCESS',
          payload: json.Search
        });
      } else {
        dispatch({
          type: 'SEARCH_MOVIE_FAILURE',
          error: json.Error
        })
      }
    });
  };

  const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header text='HOOKED' />
      <Search search={search} />
      <p className='App-intro'>Sharing a few our favourite movies</p>
      <div className='movies'>
        {loading && !errorMessage ? (
          <span>loading...</span>
        ) : errorMessage ? (
          <div className='errorMessage'>{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
            ))
        )}
      </div>
    </div>
  );
};

export default App;
