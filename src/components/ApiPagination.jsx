import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PaimonConfuse from '../assets/img/Paimon_Confuse.png'
import '../sass/components/_ApiPagination.scss'

const ApiPagination = () => {
  const [data, setData] = useState({
    characters: [],
    locations: [],
    episodes: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [imageUrls, setImageUrls] = useState({})
  const fallbackImage = PaimonConfuse

  const fetchData = async () => {
    try {
      setLoading(true)
      const [charactersRes, locationsRes, episodesRes] = await Promise.all([
        axios.get('https://rickandmortyapi.com/api/character'),
        axios.get('https://rickandmortyapi.com/api/location'),
        axios.get('https://rickandmortyapi.com/api/episode'),
      ])

      setData({
        characters: charactersRes.data.results.map((char) => ({
          id: `char-${char.id}`,
          name: char.name,
          portrait: char.image,
        })),
        locations: locationsRes.data.results.map((loc) => ({
          id: `loc-${loc.id}`,
          name: loc.name,
          portrait: null, // no image provided
        })),
        episodes: episodesRes.data.results.map((ep) => ({
          id: `ep-${ep.id}`,
          name: `${ep.episode} - ${ep.name}`,
          portrait: null, // no image provided
        })),
      })
    } catch (err) {
      setError(`Error fetching data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (item) => {
    if (imageUrls[item.id]) return imageUrls[item.id]

    const imageUrl = item.portrait || fallbackImage
    const img = new Image()
    img.onload = () => setImageUrls((prev) => ({ ...prev, [item.id]: imageUrl }))
    img.onerror = () => setImageUrls((prev) => ({ ...prev, [item.id]: fallbackImage }))
    img.src = imageUrl

    return imageUrl
  }

  useEffect(() => {
    fetchData()
  }, [])

  const allItems = [...data.characters, ...data.locations, ...data.episodes]
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem)

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage * itemsPerPage >= allItems.length

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <main className="api-pagination">
      <header></header>
      <section className="item-list">
        {currentItems.map((item) => (
          <article className="card" key={item.id}>
            <img
              src={getImageUrl(item)}
              alt={item.name || 'Unnamed'}
              className="card-image"
            />
            <h3 className="card-title">{item.name}</h3>
          </article>
        ))}
      </section>
      <nav className="pagination">
        <button onClick={() => setCurrentPage((prev) => prev - 1)} disabled={isFirstPage}>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(allItems.length / itemsPerPage)}
        </span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={isLastPage}>
          Next
        </button>
      </nav>
    </main>
  )
}

export default ApiPagination
