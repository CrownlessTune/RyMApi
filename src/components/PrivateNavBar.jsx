import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../sass/components/_PrivateNavBar.scss';
import '../sass/themes/theme.scss';
import RickIcon from '../assets/img/Rick_Icon.png';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';  

const PencilIcon = ({ fill }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={fill}
    viewBox="0 0 24 24"
    width="24"
    height="24"
    aria-hidden="true"
  >
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
  </svg>
);

const PrivateNavBar = () => {
  const { user, logout } = useAuth();  
  const [username, setUsername] = useState('');
  const [currentTheme, setCurrentTheme] = useState('Morty'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const themeRef = useRef(null);
  const navigate = useNavigate();

  const themes = {
    Rick: 'Rick',     // oscuro
    Morty: 'Morty',   // claro
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme || themes.Morty;
    handleThemeChange(initialTheme);
  }, []);

  useEffect(() => {
    
    if (user?.uid) {
      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || 'User');
        }
      };
      fetchUserData();
    } else {
      setUsername('');
    }
  }, [user]);

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    document.body.classList.remove(...Object.values(themes));
    document.body.classList.add(themeName);
    localStorage.setItem('theme', themeName);
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === themes.Rick ? themes.Morty : themes.Rick;
    handleThemeChange(newTheme);
    setIsThemeMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    logout(); 
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
    handleThemeChange(themes.Morty);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pencilColor = currentTheme === themes.Rick ? '#fff' : '#000';

  return (
    <header className="navbar" role="banner">
      <h1 className="navbar-logo">
        <Link to="/" aria-label="Go to homepage">
          <img src={RickIcon} alt="Rick icon" />
        </Link>
      </h1>

      <nav className="navbar-menu" ref={menuRef} aria-label="Main menu">
        <button
          className="navbar-menu-trigger"
          aria-expanded={isMenuOpen}
          aria-controls="menu-list"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          Menu
        </button>
        {isMenuOpen && (
          <ul id="menu-list" className="navbar-menu-dropdown" role="menu">
            <li><Link to="/regions" role="menuitem">Locations</Link></li>
            <li><Link to="/characters" role="menuitem">Characters</Link></li>
            <li><Link to="/enemies" role="menuitem">Episodes</Link></li>
          </ul>
        )}
      </nav>

      <section className="navbar-auth">
        <span aria-label="Username" className="navbar-user">{username}</span>
        <Link to="/user" aria-label="Go to profile">
          <button>Profile</button>
        </Link>
        <button onClick={handleLogout}>Log Out</button>
      </section>

      <section className="navbar-theme" ref={themeRef}>
        <button
          className="theme-button"
          aria-label={`Switch theme. Current: ${currentTheme}`}
          title={`Switch theme. Current: ${currentTheme}`}
          onClick={toggleTheme}
        >
          <PencilIcon fill={pencilColor} />
        </button>
      </section>
    </header>
  );
};

export default PrivateNavBar;
