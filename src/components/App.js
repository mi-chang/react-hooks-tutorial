import React, { useState, useEffect } from 'react';
import '../App.css';
import Header from './Header';
import Movie from './Movie';
import Search from './Search';

const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [loading, setLoading] = useState(true)
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?s=man&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(json => {
      setMovies(json.Search);
      setLoading(false);
    })
  }, []);

  const search = searchValue => {
    setLoading(true)
    setErrorMessage(null);

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=${API_KEY}`)
    .then(res => res.json())
    .then(json => {
      if (json.Response === 'True') {
        setMovies(json.Search);
        setLoading(false);
      } else {
        setErrorMessage(json.Error);
        setLoading(false);
      }
    });
  };

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
}

export default App;
