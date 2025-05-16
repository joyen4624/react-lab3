import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './screens/HomeScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function CustomerTabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName = '';
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Appointments') iconName = 'calendar-check';
            else if (route.name === 'Profile') iconName = 'account';
            return <Icon name={iconName} color={color} size={size} />;
          },
          tabBarActiveTintColor: '#f05a72',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Appointments" component={AppointmentsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
