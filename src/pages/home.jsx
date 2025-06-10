import React from 'react';
import LayoutPublic from '../layout/PublicLayout';
import ApiPagination from '../components/ApiPagination';
import '../sass/pages/_Home.scss';  

function Home() {
  return (
      <main className="home-page">
        <h1 className="title">RickPedia</h1>
        <h2 className="subtitle">Welcome to RickPedia</h2>
        <p className="description">
          Genshin Api is a website where you can visit all the information you need about your favourite characters or enemies you want to defeat.
          <br />
          Furthermore, you can create your own profile, design it your way, and create your own posts and comment on others' ones.
        </p>
        <ApiPagination />
      </main>
  );
}

export default Home;
