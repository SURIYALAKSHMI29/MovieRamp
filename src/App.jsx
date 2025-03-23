import React, { useEffect, useState } from 'react'
import Search from './components/search';
import LoadingSpinner  from './components/LoadingSpinner';
import MovieCard from './components/MovieCard';
import Footer from './footer'

import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js';

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
console.log(API_KEY);

const API_OPTIONS = {
  method : 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}` // verifies who is trying to make the request
  }
}

// Problem - whenever user enters a character in search bar, the search results are changed dynamically
// which might overwhelm our server - API requests
// "Debounce" is a way to delay the execution of a function until a certain amount of time has passed

// we have pre defined useDebounce react hook

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // API takes some time to fetch
  
  const [trendingMovies, setTrendingMovies] = useState([]);
  
  useDebounce(
    () => 
      setDebouncedSearchTerm(searchTerm),
      500, // Wait for 500ms before updating
      [searchTerm]
  );  // updates the debouncedSearchTerm whenever searchTerm changes, by waiting for the user to stop typing for 500ms

  const fetchMovies = async (query = '') => {
    try{

      setIsLoading(true);
      setErrorMessage('');
      
      const endPoint = query? 
        `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : 
        `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      console.log(`API :`);
      const response = await fetch(endPoint, API_OPTIONS);
      console.log("Response Status:", response.status);

      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      console.log(data);

      if(data.Response == 'False'){
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0){
         await updateSearchCount(query, data.results[0]);
      }

    } catch(error){
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage("Uh-oh! Something went wrong. Try again in a bit.");
    } finally{
      setIsLoading(false);
    }
  }

  const fetchTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch(error){
      console.log(`Error fetching trending movies: ${error}`);
    } finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);
  
  return (
    <main>
      <div className='pattern'/>

      <div className='wrapper'>

        <header className='header'>
          <img src='./hero.png' alt="Hero backGround"/>
          <h1>Scroll Less, <span className='text-gradient'>Watch More!</span></h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {/* don't call the function here, which will make that as undefined 
              (i.e) calls the function immediately as soon as the search component rendered
              setSearchTerm={setSearchTerm()} => nope
              setSearchTerm={setSearchTerm} // passing the func declaration, so this function can be called form search component
          */}
        </header>

        <section className='trending-movies'>
          {trendingMovies.length > 0 && (
            <section className='trending'>
              <h2>🔥 Must-Watch Hits!</h2>

              <ul>
                {trendingMovies.map((movie, index) =>(
                  // movie fetched from database, so '$id'
                   <li key={movie.$id} className='trending-movie'>    
                      <p>{index+1}</p>
                      <img src={movie.poster_url} alt={movie.title}/>
                   </li>
                ))}
              </ul>
            </section>
          )}
        </section>
  
        <section className='all-movies'>
            <h2>All Movies</h2>

            {isLoading? (
              <div className="flex flex-col items-center">
                <p className="text-lg font-medium mb-2 text-yellow-400 animate-pulse">Loading awesome movies… Grab your popcorn! 🍿</p>
                <LoadingSpinner />
              </div>
            ) : errorMessage?(
                  <p className='text-red-500'>{errorMessage}</p>
              ) : (
              <ul>
                {movieList.map((movie) =>(
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
        </section>

      </div>

      <Footer/>      
    </main>
  )
}

export default App;