import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import fallbackImage from '../assets/img/Paimon_Confuse.png';
import '../sass/components/_Favourite.scss';

const Favourite = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://rickandmortyapi.com/api/character');
      setCharacters(response.data.results);
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError('Error fetching characters');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (item) => {
    if (imageUrls[item.id]) return imageUrls[item.id];

    const img = new Image();
    img.onload = () => {
      setImageUrls((prev) => ({ ...prev, [item.id]: item.image }));
      localStorage.setItem(item.id, item.image);
    };
    img.onerror = () => {
      setImageUrls((prev) => ({ ...prev, [item.id]: fallbackImage }));
      localStorage.setItem(item.id, fallbackImage);
    };
    img.src = item.image;

    return item.image;
  };

  const fetchFavorites = async () => {
    if (!userId) return;

    try {
      const snapshot = await getDocs(collection(db, 'favorites', userId, 'items'));
      const favs = [];
      snapshot.forEach((doc) => favs.push({ id: doc.id, ...doc.data() }));
      setFavorites(favs);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Error fetching favorites');
    }
  };

  const saveFavorite = async (item) => {
    if (!userId) return;

    try {
      await setDoc(doc(db, 'favorites', userId, 'items', item.id.toString()), item);
      setFavorites((prev) => [...prev, item]);
    } catch (error) {
      console.error('Error saving favorite:', error);
      setError('Error saving favorite');
    }
  };

  const removeFavorite = async (item) => {
    if (!userId) return;

    try {
      await deleteDoc(doc(db, 'favorites', userId, 'items', item.id.toString()));
      setFavorites((prev) => prev.filter((fav) => fav.id !== item.id));
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Error removing favorite');
    }
  };

  const toggleFavorite = (item) => {
    const isFav = favorites.some((fav) => fav.id === item.id);
    isFav ? removeFavorite(item) : saveFavorite(item);
  };

  useEffect(() => {
    if (userId) {
      fetchCharacters();
      fetchFavorites();
    }
  }, [userId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = characters.slice(indexOfFirstItem, indexOfLastItem);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage * itemsPerPage >= characters.length;

  return (
    <div className="api-pagination">
      <div className="favorites-list">
        <h2>Favorites</h2>
        {favorites.map((fav) => (
          <div key={fav.id} className="favorite-card">
            <img src={getImageUrl(fav)} alt={fav.name} className="favorite-image" />
            <p>{fav.name}</p>
          </div>
        ))}
      </div>

      <button onClick={() => setShowModal(true)} className="edit-favorites-btn">Edit Favorites</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Characters</h2>
            <div className="item-list">
              {currentItems.map((item) => (
                <div className="card" key={item.id}>
                  <img src={getImageUrl(item)} alt={item.name} className="card-image" />
                  <h3 className="card-title">{item.name}</h3>
                  <button onClick={() => toggleFavorite(item)} className="add-to-fav-btn">
                    {favorites.some((fav) => fav.id === item.id) ? 'Remove from Fav' : 'Add to Fav'}
                  </button>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button onClick={() => setCurrentPage((prev) => prev - 1)} disabled={isFirstPage}>
                Previous
              </button>
              <span>Page {currentPage}</span>
              <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={isLastPage}>
                Next
              </button>
            </div>

            <button onClick={() => setShowModal(false)} className="close-modal-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourite;
