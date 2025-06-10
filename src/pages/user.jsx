import React, { Suspense } from 'react';
import PrivateLayout from '../layout/PrivateLayout';

const UserProfile = React.lazy(() => import('../components/UserProfile'));

const User = () => {
  return (
    <main aria-labelledby="user-profile-heading">
      <UserProfile />
    </main>
  );
};

export default User;
