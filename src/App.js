import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddFavorite from "./components/AddFavorite";
import MovieList from "./components/MovieList";
import MovieListHeading from "./components/MovieListHeading";
import RemoveFavorites from "./components/RemoveFavorites";
import SearchBox from "./components/SearchBox";

const App = () => {
  const [favorites, setFavorites] = useState([]);
  const [movies, setMovies] = useState([ ]);
  const [searchValue, setSearchValue] = useState('');

  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=263d22d8`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  const addFavoriteMovie = (movie) => {
    const newFavoriteList = [...favorites, movie];
    setFavorites(newFavoriteList);
    saveToLocalStorage(newFavoriteList);
  };

  const removeFavoriteMovie = (movie) => {
    const newFavoriteList = favorites.filter(
      (favorite) => favorite.imdbID !== movie.imdbID  
    );
    setFavorites(newFavoriteList);
    saveToLocalStorage(newFavoriteList);
  };

  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const movieFavorites = JSON.parse(
      localStorage.getItem('react-movie-app-favorites')
    );
    setFavorites(movieFavorites);
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favorites', JSON.stringify(items));
  };

  return (
    <div className="container-fluid movie-app">
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading='Movies '/>
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className="row">
        <MovieList 
          movies={movies} 
          favoriteComponent={AddFavorite} 
          handleFavoritesClick={addFavoriteMovie}
        />
      </div>
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading='Faves '/>
      </div>
      <div className="row">
        <MovieList 
          movies={favorites} 
          favoriteComponent={RemoveFavorites} 
          handleFavoritesClick={removeFavoriteMovie}  
        />
      </div>
    </div>
  );
};

export default App;
