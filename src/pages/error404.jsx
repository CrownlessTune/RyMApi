import React from 'react';
import { Link } from 'react-router-dom';
import LayoutPublic from '../layout/PublicLayout';
import RyM404 from '../assets/img/404.png';
import '../sass/pages/_Error.scss';

const Error404 = () => {
  return (
      <div className="error-404">
        <h1>404 Error</h1>
        <img src={RyM404} alt="Paimon Confused" />
        <p>Morty, Creo que este no es el sitio. Burp...</p>
        <Link to="/" className="back-home">Go Back Home</Link>
      </div>
  );
};

export default Error404;
