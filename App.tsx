import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';
import CreateAppointmentScreen from './screens/CreateAppointmentScreen';
import EditAppointmentScreen from './screens/EditAppointmentScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';

// Admin
import AdminHomeScreen from './screens/Admin/AdminHomeScreen';
import ServiceManagerScreen from './screens/Admin/ServiceManagerScreen';
import EditServiceScreen from './screens/Admin/EditCustomerScreen';
import AppointmentManagerScreen from './screens/Admin/AppointmentManagerScreen';
import CustomerManagerScreen from './screens/Admin/CustomerManagerScreen';
import AddServiceScreen from './screens/Admin/AddServiceScreen';
import EditAppointmentAdminScreen from './screens/Admin/EditAppointmentScreen';
import EditCustomerScreen from './screens/Admin/EditCustomerScreen';


// Customer tabs
import CustomerTabNavigator from './navigators/CustomerTabNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Auth screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* Customer tab navigator */}
        <Stack.Screen name="Home" component={CustomerTabNavigator} />

        {/* Shared screens */}
        <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
        <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />
        <Stack.Screen name="EditAppointment" component={EditAppointmentScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

        {/* Admin */}
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="ServiceManager" component={ServiceManagerScreen} />
        <Stack.Screen name="AddServiceScreen" component={AddServiceScreen} />
        <Stack.Screen name="EditService" component={EditServiceScreen} />
        <Stack.Screen name="AppointmentManager" component={AppointmentManagerScreen} />
        <Stack.Screen name="CustomerManager" component={CustomerManagerScreen} />
        <Stack.Screen name="EditCustomerScreen" component={EditCustomerScreen} />
        <Stack.Screen name="EditAppointmentScreen" component={ EditAppointmentAdminScreen} />
       

      </Stack.Navigator>
    </NavigationContainer>
  );
}
