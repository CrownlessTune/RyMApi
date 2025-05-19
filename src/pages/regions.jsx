import React, { useState } from 'react';
import LayoutPublic from '../layout/PublicLayout';
import LocationSearch from '../components/LocationSearch';


const Regions = () => {

  return(
    <LayoutPublic>
      <h1>Regions</h1>
      <LocationSearch></LocationSearch>

    </LayoutPublic>


  );


}


export default Regions;
