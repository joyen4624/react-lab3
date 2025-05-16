import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Appbar, Card, Button } from 'react-native-paper';

export default function CustomerManagerScreen({ navigation }: any) {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(list);
      });
    return () => unsubscribe();
  }, []);

  const handleUpdate = (customer: any) => {
    navigation.navigate('EditCustomerScreen', { customer });
  };

  const renderItem = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Content style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name || '(Không tên)'}</Text>
          <Text style={styles.info}>Email: {item.email}</Text>
        </View>
        <Button onPress={() => handleUpdate(item)}>Cập nhật</Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
        <Appbar.Content title="Quản lý khách hàng" />
      </Appbar.Header>

      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
});
