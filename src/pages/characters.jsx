import React, { Suspense } from 'react';


const CharacterSearch = React.lazy(() => import('../components/CharacterSearch'));

const Characters = () => {
  return (
    <Suspense fallback={<div>Loading character search...</div>}>
      <CharacterSearch />
    </Suspense>
  );
};

export default Characters;
