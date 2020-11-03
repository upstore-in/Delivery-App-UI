import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StateContext from '../StateContext';
import { OrdersDrawerNav, AuthNavigator } from './OrdersNavigator';

const AppNavigator = props => {
  const mainState = useContext(StateContext);
  return <NavigationContainer>{mainState.loggedIn ? <OrdersDrawerNav /> : <AuthNavigator />}</NavigationContainer>;
};

export default AppNavigator;
