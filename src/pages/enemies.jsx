import React, { useState } from 'react';
import LayoutPublic from '../layout/PublicLayout';
import EpisodesSearch from '../components/EpisodesSearch';


const Enemies = () => {

  return(
    <LayoutPublic>
      <h1>Episodes</h1>
      <EpisodesSearch></EpisodesSearch>

    </LayoutPublic>


  );


}


export default Enemies;
