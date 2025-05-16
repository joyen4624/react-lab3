import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminHomeScreen from '../screens/Admin/AdminHomeScreen';
import AppointmentManagerScreen from '../screens/Admin/AppointmentManagerScreen';

import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function AdminTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f05a72',
      }}
    >
      <Tab.Screen
        name="AdminHomeTab"
        component={AdminHomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AppointmentManagerTab"
        component={AppointmentManagerScreen}
        options={{
          tabBarLabel: 'Lịch hẹn',
          tabBarIcon: ({ color, size }) => <Icon name="event" color={color} size={size} />,
        }}
      />

    </Tab.Navigator>
  );
}
