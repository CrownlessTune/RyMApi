import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../sass/components/_LocationSearch.scss';

const LOCATION_TYPES = [
  '', // opción vacía para "Todos"
  'Planet',
  'Cluster',
  'Space station',
  'Microverse',
  'TV',
  'Resort',
  'Fantasy town',
  'Dream',
  'Dimension',
  'unknown'
];

const LOCATION_DIMENSIONS = [
  '',
  'Dimension C-137',
  'Replacement Dimension',
  'Cronenberg Dimension',
  'Fantasy Dimension',
  'Dimension 5-126',
  'Testicle Monster Dimension',
  'unknown'
];

const LocationSearch = () => {
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({ name: '', type: '', dimension: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('https://rickandmortyapi.com/api/location', {
        params: {
          page: currentPage,
          name: filters.name || undefined,
          type: filters.type || undefined,
          dimension: filters.dimension || undefined
        }
      });
      setLocations(response.data.results);
      setTotalPages(response.data.info.pages);
    } catch (err) {
      setLocations([]);
      setTotalPages(1);
      setError('No results found or API error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [filters, currentPage]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ name: '', type: '', dimension: '' });
  };

  return (
    <section className="location-search" aria-label="Location search section">
      <h2>Search Locations</h2>

      <form
        className="filters"
        onSubmit={e => e.preventDefault()}
        aria-describedby="filter-desc"
      >
        <p id="filter-desc" className="sr-only">Filter locations by name, type and dimension.</p>

        <div className="filter-group">
          <label htmlFor="name">Name</label>
          <input
            type="search"
            id="name"
            name="name"
            placeholder="Location name"
            value={filters.name}
            onChange={handleChange}
            aria-label="Filter by location name"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleChange}
            aria-label="Filter by location type"
          >
            {LOCATION_TYPES.map((type, i) => (
              <option key={i} value={type}>{type || 'All types'}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="dimension">Dimension</label>
          <select
            id="dimension"
            name="dimension"
            value={filters.dimension}
            onChange={handleChange}
            aria-label="Filter by dimension"
          >
            {LOCATION_DIMENSIONS.map((dim, i) => (
              <option key={i} value={dim}>{dim || 'All dimensions'}</option>
            ))}
          </select>
        </div>

        <button type="button" onClick={resetFilters} aria-label="Clear filters">Clear</button>
      </form>

      {loading && <p role="status">Loading locations...</p>}
      {error && <p role="alert">{error}</p>}

      <div className="location-list" role="list" aria-live="polite">
        {locations.map((loc) => (
          <article key={loc.id} className="location-card" role="listitem" tabIndex={0}>
            <h3>{loc.name}</h3>
            <p><strong>Type:</strong> {loc.type}</p>
            <p><strong>Dimension:</strong> {loc.dimension}</p>
            <p><strong>Residents:</strong> {loc.residents.length}</p>
          </article>
        ))}
      </div>

      <nav className="pagination" aria-label="Pagination navigation">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
          aria-disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
          aria-disabled={currentPage === totalPages}
        >
          Next
        </button>
      </nav>
    </section>
  );
};

export default LocationSearch;
