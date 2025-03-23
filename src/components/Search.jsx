import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  // destructured the props here
  return (
    <div className='search'>
        <div>
          <img src='search.png' alt='search img'/>

          <input 
            type='text'
            placeholder='Search through thousands of movies...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>
    </div>
  )
}

export default Search