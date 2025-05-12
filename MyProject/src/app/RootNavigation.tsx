import React from 'react';
import {AuthProvider} from '../../context/authContext';
import AppNavigator from './AppNavigator';

const RootNavigation = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default RootNavigation;
