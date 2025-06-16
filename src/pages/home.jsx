import React from 'react';
import LayoutPublic from '../layout/PublicLayout';
import ApiPagination from '../components/ApiPagination';
import '../sass/pages/_Home.scss';  

function Home() {
  return (
      <main className="home-page">
        <h1 className="title">RickPedia</h1>
        <p className="description">
          La Rickpedia más Mortyana posible. Ten acceso a toda la información que necesites sobre tu serie favorita gracias a esta web específicamente diseñada
 para tus más alcohólicos sueños. Por favor, vete ya de aquí, estoy borracho, Burp... Morty, ¿Quien ha dejado esto aquí?
        </p>
        <ApiPagination />
      </main>
  );
}

export default Home;
