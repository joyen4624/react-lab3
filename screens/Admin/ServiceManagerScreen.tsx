import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Appbar, FAB } from 'react-native-paper';

export default function ServiceManagerScreen({ navigation }: any) {
  const [services, setServices] = useState<any[]>([]);

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

  const handleDelete = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá dịch vụ này?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          try {
            await firestore().collection('services').doc(id).delete();
            Alert.alert('✅ Xoá thành công');
          } catch (err: any) {
            Alert.alert('❌ Lỗi', err.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.serviceBox}
      onPress={() => navigation.navigate('UpdateService', { id: item.id })}
      onLongPress={() => handleDelete(item.id)}
    >
      <Text style={styles.serviceName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.price}>{item.price?.toLocaleString()} đ</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Quản lý dịch vụ" />
      </Appbar.Header>

      <FlatList
        data={services}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <FAB
        icon="plus"
        label="Thêm dịch vụ"
        style={styles.fab}
        onPress={() => navigation.navigate('AddServiceScreen')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  serviceBox: {
    marginVertical: 6,
    padding: 14,
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
    borderRadius: 30,
  },
});
