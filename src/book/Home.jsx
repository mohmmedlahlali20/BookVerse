import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    const fetchHeroes = async () => {
      const options = {
        method: 'GET',
        url: 'https://superhero-search.p.rapidapi.com/api/heroes',
        headers: {
          'X-RapidAPI-Key': '1a925f14e0msh40719e8bfbe1677p18c946jsn11a999176c6c',
          'X-RapidAPI-Host': 'superhero-search.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        console.log(response.data); // Log the response data
        setHeroes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHeroes();
  }, []);

  return (
    <div className="container">
      <h1>Book Search</h1>
      <div className="input-group mb-3">
        <input type="text" className="form-control" placeholder="Search for books..." aria-label="Search for books" aria-describedby="basic-addon2" />
        <div className="input-group-append">
          <button className="btn btn-primary" type="button">Search</button>
        </div>
      </div>
      {/* Display heroes */}
      <div>
        <h2>Superheroes</h2>
        <ul>
          {heroes.map(hero => (
            <li key={hero.id}>{hero.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
