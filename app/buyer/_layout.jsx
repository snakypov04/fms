import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './Profile';
import Products from './Products';
import Cart from './Cart';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BuyerLayout() {
  return (
    <Tab.Navigator
      initialRouteName="Products" // Default to Products tab
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Determine the icon based on route name
          let iconName;
          switch (route.name) {
            case 'Products':
              iconName = focused ? 'pricetags' : 'pricetags-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle-outline'; // Fallback icon
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50', // Active tab color
        tabBarInactiveTintColor: 'gray',  // Inactive tab color
        headerShown: false,              // Disable default header
      })}
    >
      {/* Tabs */}
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Products" component={Products} />
      <Tab.Screen name="Cart" component={Cart} />

    </Tab.Navigator>
  );
}
