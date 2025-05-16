import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Appbar, FAB } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

// 212482010151 - Lê Sỹ Hoài

export default function HomeScreen({ navigation }: any) {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
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
      setUsername(email.split('@')[0]);
    }
  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.serviceBox}
      onPress={() => navigation.navigate('ServiceDetail', { id: item.id })}
    >
      <Text style={styles.serviceName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.price}>{item.price?.toLocaleString()} đ</Text>
    </TouchableOpacity>
  );


  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
      <Appbar.Content title={username.toUpperCase() || 'KAMI SPA'} />
      <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <Image
        source={require('../assets/images/logolab3.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.heading}>Danh sách dịch vụ</Text>

      <TextInput
        placeholder="Tìm kiếm dịch vụ..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        data={filteredServices}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddService')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  logo: {
    alignSelf: 'center',
    width: 160,
    height: 80,
    marginTop: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
    marginTop: 8,
    color: '#333',
  },
  search: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  serviceBox: {
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
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#f05a72',
  },
});
