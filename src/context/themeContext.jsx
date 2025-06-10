import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  Rick: 'Rick',   // modo oscuro
  Morty: 'Morty', // modo claro
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.Morty);

  const applyTheme = (themeName) => {
    document.body.classList.remove(...Object.values(themes));
    document.body.classList.add(themeName);
  };

  const toggleTheme = () => {
    const newTheme = theme === themes.Rick ? themes.Morty : themes.Rick;
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const initialTheme = storedTheme && Object.values(themes).includes(storedTheme)
      ? storedTheme
      : themes.Morty;
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
