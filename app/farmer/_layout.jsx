import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./Profile";
import Farms from "./Farms";
import Inventory from "./Inventory";
import Orders from "./Orders";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function layout() {
	return (
		<Tab.Navigator
			initialRouteName="Farms" // Default to Farms tab
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "Profile") {
						iconName = focused ? "person" : "person-outline";
					} else if (route.name === "Farms") {
						iconName = focused ? "leaf" : "leaf-outline";
					} else if (route.name === "Inventory") {
						iconName = focused ? "cube" : "cube-outline";
					} else if (route.name === "Orders") {
						iconName = focused ? "cart" : "cart-outline";
					}

					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: "#4CAF50",
				tabBarInactiveTintColor: "gray",
				headerShown: false,
			})}
		>
			<Tab.Screen name="Profile" component={Profile} />
			<Tab.Screen name="Farms" component={Farms} />
			<Tab.Screen name="Inventory" component={Inventory} />
			<Tab.Screen name="Orders" component={Orders} />
		</Tab.Navigator>
	);
}
