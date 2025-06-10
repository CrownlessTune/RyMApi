import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PaimonConfuse from '../assets/img/Paimon_Confuse.png'
import '../sass/components/_ApiPagination.scss'

const ApiPagination = () => {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [visitedPages, setVisitedPages] = useState(new Set())
  const itemsPerPage = 5
  const [imageUrls, setImageUrls] = useState({})
  const fallbackImage = PaimonConfuse

  const fetchAllCharacters = async () => {
    try {
      setLoading(true)
      const firstPage = await axios.get('https://rickandmortyapi.com/api/character')
      const totalPages = firstPage.data.info.pages
      const allRequests = []

      for (let i = 1; i <= totalPages; i++) {
        allRequests.push(axios.get(`https://rickandmortyapi.com/api/character?page=${i}`))
      }

      const responses = await Promise.all(allRequests)
      const allChars = responses.flatMap((res) =>
        res.data.results.map((char) => ({
          id: `char-${char.id}`,
          name: char.name,
          portrait: char.image,
        }))
      )

      setCharacters(allChars)
    } catch (err) {
      setError(`Error fetching characters: ${err.message}`)
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
    fetchAllCharacters()
  }, [])

  useEffect(() => {
    setVisitedPages((prev) => new Set(prev).add(currentPage))
  }, [currentPage])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = characters.slice(indexOfFirstItem, indexOfLastItem)

  const isFirstPage = currentPage === 1
  const isLastPage = indexOfLastItem >= characters.length
  const totalPages = Math.ceil(characters.length / itemsPerPage)

const getPageNumbers = () => {
  const totalPages = Math.ceil(characters.length / itemsPerPage)
  const pages = new Set()

  pages.add(1)

  for (let i = currentPage - 3; i <= currentPage + 3; i++) {
    if (i > 1 && i < totalPages) {
      pages.add(i)
    }
  }

  if (totalPages > 1) {
    pages.add(totalPages)
  }

  return Array.from(pages).sort((a, b) => a - b)
}


  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <main className="api-pagination">
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
          Prev
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`${page === currentPage ? 'active' : ''} ${visitedPages.has(page) ? 'visited' : ''}`}
          >
            {page}
          </button>
        ))}

        <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={isLastPage}>
          Next
        </button>
      </nav>
    </main>
  )
}

export default ApiPagination
