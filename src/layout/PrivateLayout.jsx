import React from 'react';
import { Outlet } from 'react-router-dom';
import PrivateNavBar from '../components/PrivateNavBar';
import Footer from '../components/Footer';
import '../sass/layout/_PublicLayout.scss';

const PrivateLayout = ({ mainStyle, username, onLogout }) => {
  return (
    <section className="public-layout">
      <PrivateNavBar className="navbar" username={username} onLogout={onLogout} />
      <main style={mainStyle}>
        <Outlet />
      </main>
      <Footer className="footer" />
    </section>
  );
};

export default PrivateLayout;
