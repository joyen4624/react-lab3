import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppointmentManagerScreen from './AppointmentManagerScreen';
import CustomerManagerScreen from './CustomerManagerScreen';


const Tab = createBottomTabNavigator();

function ServiceTab({ navigation }: any) {
  const [services, setServices] = useState<any[]>([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('services')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setServices(data);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const email = user.email || '';
      setUsername(email.split('@')[0].toUpperCase());
    }
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.serviceItem}>
      <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.servicePrice}>{item.price?.toLocaleString()} ₫</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
        <Appbar.Content title={username} />
        <Appbar.Action icon="account-circle" onPress={() => {}} />
      </Appbar.Header>

      <Image
        source={require('../../assets/images/logolab3.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.headerRow}>
        <Text style={styles.heading}>Danh sách dịch vụ</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ServiceManager')}>
          <FAB icon="plus" style={styles.addBtn} small />
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

export default function AdminHomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f05a72',
      }}
    >
      <Tab.Screen
        name="ServiceTab"
        component={ServiceTab}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AppointmentTab"
        component={AppointmentManagerScreen}
        options={{
          tabBarLabel: 'Transaction',
          tabBarIcon: ({ color, size }) => <Icon name="event" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Customer"
        component={CustomerManagerScreen}
        options={{
          tabBarLabel: 'Customer',
          tabBarIcon: ({ color, size }) => <Icon name="profile" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  logo: {
    alignSelf: 'center',
    width: 180,
    height: 80,
    marginTop: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
    color: '#333',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
  },
  addBtn: {
    backgroundColor: '#f05a72',
    marginRight: 4,
  },
  serviceItem: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    marginRight: 10,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
});
