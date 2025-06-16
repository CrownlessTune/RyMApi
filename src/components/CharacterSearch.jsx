import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../sass/components/_CharacterSearch.scss';

const CharacterSearch = () => {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ species: '', gender: '', status: '' });
  const charactersGridRef = useRef(null);

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('filters'));
    if (savedFilters) {
      setFilters(savedFilters);
    }
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        let allCharacters = [];
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
          allCharacters = [...allCharacters, ...response.data.results];
          hasNextPage = !!response.data.info.next;
          page++;
        }

        setCharacters(allCharacters);
        setFilteredCharacters(allCharacters);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    const { species, gender, status } = filters;
    const filtered = characters.filter((char) => {
      return (
        (!species || char.species.toLowerCase() === species.toLowerCase()) &&
        (!gender || char.gender.toLowerCase() === gender.toLowerCase()) &&
        (!status || char.status.toLowerCase() === status.toLowerCase())
      );
    });
    setFilteredCharacters(filtered);
  }, [filters, characters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    localStorage.setItem('filters', JSON.stringify(newFilters));
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = charactersGridRef.current;
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
        console.log('Reached the end of the scroll');
      }
    };

    const gridElement = charactersGridRef.current;
    if (gridElement) {
      gridElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main className="character-search-container">
      <header>
        <h1>Rick and Morty Characters</h1>
      </header>
      <section className="filters" aria-label="Filter options">
        <label>
          Species:
          <select name="species" onChange={handleFilterChange} value={filters.species}>
            <option value="">All</option>
            <option value="Human">Human</option>
            <option value="Alien">Alien</option>
            <option value="Humanoid">Humanoid</option>
            <option value="Robot">Robot</option>
            <option value="Animal">Animal</option>
            <option value="Mythological Creature">Mythological</option>
          </select>
        </label>
        <label>
          Gender:
          <select name="gender" onChange={handleFilterChange} value={filters.gender}>
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label>
          Status:
          <select name="status" onChange={handleFilterChange} value={filters.status}>
            <option value="">All</option>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </section>
      <section className="characters-grid" aria-label="Character results">
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {filteredCharacters.map((character) => (
            <li className="character-card" key={character.id}>
              <article>
                <h2>{character.name}</h2>
                <img
                  src={character.image}
                  alt={`Image of ${character.name}`}
                  className="character-image"
                />
                <p>Species: {character.species}</p>
                <p>Gender: {character.gender}</p>
                <p>Status: {character.status}</p>
                <p>Origin: {character.origin.name}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default CharacterSearch;
