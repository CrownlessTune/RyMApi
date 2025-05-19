import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../sass/components/_EnemiesSearch.scss';
import PaimonConfuse from '../assets/img/Paimon_Confuse.png';

const EpisodesSearch = () => {
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const episodesGridRef = useRef(null);
  const [search, setSearch] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [episodeNumberFilter, setEpisodeNumberFilter] = useState('');

  const handleImageError = (e) => {
    e.target.src = PaimonConfuse;
  };

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const allEpisodes = [];
        let page = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const res = await axios.get(`https://rickandmortyapi.com/api/episode?page=${page}`);
          allEpisodes.push(...res.data.results);
          hasNextPage = res.data.info.next !== null;
          page++;
        }

        setEpisodes(allEpisodes);
        setFilteredEpisodes(allEpisodes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  useEffect(() => {
    const filtered = episodes.filter((ep) => {
      const episodeCode = ep.episode.toUpperCase(); // e.g. "S01E01"
      const nameMatch = ep.name.toLowerCase().includes(search.toLowerCase());
      const codeMatch = episodeCode.includes(search.toUpperCase());
      const seasonMatch = seasonFilter ? episodeCode.startsWith(seasonFilter) : true;
      const episodeMatch = episodeNumberFilter
        ? episodeCode.endsWith(`E${episodeNumberFilter.padStart(2, '0')}`)
        : true;

      return (nameMatch || codeMatch) && seasonMatch && episodeMatch;
    });
    setFilteredEpisodes(filtered);
  }, [search, seasonFilter, episodeNumberFilter, episodes]);

  const seasons = Array.from(new Set(episodes.map((ep) => ep.episode.slice(0, 3))));
  const episodesInSeason = seasonFilter
    ? Array.from(
        new Set(
          episodes
            .filter((ep) => ep.episode.startsWith(seasonFilter))
            .map((ep) => ep.episode.slice(4, 6))
        )
      ).sort((a, b) => parseInt(a) - parseInt(b))
    : [];

  const handleScroll = () => {
    const container = episodesGridRef.current;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
      console.log('Reached the end of the scroll');
    }
  };

  useEffect(() => {
    const gridElement = episodesGridRef.current;
    if (gridElement) {
      gridElement.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (gridElement) {
        gridElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="episodes-search-container">
      <div className="filters">
        <label>
          Search:
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g., Rick or S01E01"
          />
        </label>

        <label>
          Season:
          <select value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)}>
            <option value="">All</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label>
          Episode:
          <select
            value={episodeNumberFilter}
            onChange={(e) => setEpisodeNumberFilter(e.target.value)}
            disabled={!seasonFilter}
          >
            <option value="">All</option>
            {episodesInSeason.map((epNum) => (
              <option key={epNum} value={epNum}>
                {epNum}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className="episodes-grid"
        ref={episodesGridRef}
        style={{ maxHeight: '400px', overflowY: 'auto' }}
      >
        {filteredEpisodes.length === 0 && <div>No episodes found.</div>}
        {filteredEpisodes.map((ep) => (
          <div className="episode-card" key={ep.id}>
            <h3>{ep.name}</h3>
            <img
              src={`https://rickandmortyapi.com/api/character/avatar/${ep.characters[0]?.split('/').pop()}.jpeg`}
              alt={ep.name}
              onError={handleImageError}
              className="episode-image"
            />
            <p>Episode: {ep.episode}</p>
            <p>Air date: {ep.air_date}</p>
            <p>Characters: {ep.characters.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodesSearch;
