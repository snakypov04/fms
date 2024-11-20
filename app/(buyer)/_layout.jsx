import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './Profile';
import Products from './Products';
import Cart from './Cart'; // Replace Messages with Cart
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function _layout() {
  return (
    <Tab.Navigator
      initialRouteName="Products" // Default to Products tab
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Products') {
            iconName = focused ? 'pricetags' : 'pricetags-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      {/* Left Tab: Profile */}
      <Tab.Screen name="Profile" component={Profile} />

      {/* Center Tab: Products */}
      <Tab.Screen name="Products" component={Products} />

      {/* Right Tab: Cart */}
      <Tab.Screen name="Cart" component={Cart} />
    </Tab.Navigator>
  );
}
