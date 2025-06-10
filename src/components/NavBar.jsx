import React, { useState, useEffect, useRef } from 'react'; 
import { Link } from 'react-router-dom';
import '../sass/components/_NavBar.scss';
import '../sass/themes/theme.scss';
import Icon from '../assets/img/Rick_Icon.png';

const PencilIcon = ({ fill }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill={fill} 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    aria-hidden="true"
  >
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
  </svg>
);

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('Morty'); // Morty = claro, Rick = oscuro
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const themeRef = useRef(null);

  const themes = {
    Rick: 'Rick',     // oscuro
    Morty: 'Morty',   // claro
  };

  // Cambia el tema aplicando la clase al body
  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    document.body.classList.remove(...Object.values(themes));
    document.body.classList.add(themeName);
    localStorage.setItem('theme', themeName);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme || themes.Morty;
    handleThemeChange(initialTheme);
  }, []);

  // Cierra los menús al hacer clic fuera
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

  // Cambia el tema alternando entre Rick y Morty
  const toggleTheme = () => {
    const newTheme = currentTheme === themes.Rick ? themes.Morty : themes.Rick;
    handleThemeChange(newTheme);
    setIsThemeMenuOpen(false);
  };

  // Color del lápiz según tema para que se vea bien (blanco en oscuro, negro en claro)
  const pencilColor = currentTheme === themes.Rick ? '#fff' : '#000';

  return (
    <header className="navbar" role="banner">
      <h1 className="navbar-logo">
        <Link to="/" aria-label="Go to homepage">
          <img src={Icon} alt="Paimon icon" />
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
            <li><Link to="/regions" role="menuitem">Regions</Link></li>
            <li><Link to="/characters" role="menuitem">Characters</Link></li>
            <li><Link to="/enemies" role="menuitem">Enemies</Link></li>
            <li><Link to="/community" role="menuitem">Community</Link></li>
          </ul>
        )}
      </nav>

      <section className="navbar-auth">
        {isLoggedIn ? (
          <>
            <Link to="/profile" aria-label="Go to profile">Profile</Link>
            <button onClick={() => setIsLoggedIn(false)}>Log Out</button>
          </>
        ) : (
          <Link to="/login" aria-label="Go to login page">
            <button>Login</button>
          </Link>
        )}
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

export default NavBar;
