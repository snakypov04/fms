import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './Profile';
import Farms from './Farms';
import Inventory from './Inventory';
import Orders from './Orders';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function _layout() {
  return (
    <Tab.Navigator
      initialRouteName="Farms" // Default to Farms tab
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Farms') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Inventory') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Statistics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
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

      {/* Center Tab: Farms */}
      <Tab.Screen name="Farms" component={Farms} />

      {/* Right Tab: Inventory */}
      <Tab.Screen name="Inventory" component={Inventory} />

      {/* Additional Tab: Orders */}
      <Tab.Screen name="Orders" component={Orders} />
    </Tab.Navigator>
  );
}
