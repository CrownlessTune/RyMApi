import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import '../sass/layout/_PublicLayout.scss';

const PublicLayout = ({ mainStyle }) => {
  return (
    <section className="public-layout">
      <NavBar className="navbar" />
      <main style={mainStyle}>
        <Outlet />
      </main>
      <Footer className="footer" />
    </section>
  );
};

export default PublicLayout;
