import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Appbar, Button, Card } from 'react-native-paper';

export default function AppointmentManagerScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('appointments')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(data);
      });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await firestore().collection('appointments').doc(id).update({ status: 'accepted' });
      Alert.alert('✅ Thành công', 'Lịch hẹn đã được xác nhận.');
    } catch (err: any) {
      Alert.alert('❌ Lỗi', err.message);
    }
  };

  const renderItem = ({ item }: any) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.label}>Dịch vụ:</Text>
        <Text style={styles.value}>{item.serviceName}</Text>

        <Text style={styles.label}>Ngày:</Text>
        <Text style={styles.value}>{item.date} - {item.time}</Text>

        <Text style={styles.label}>Khách hàng:</Text>
        <Text style={styles.value}>{item.userId}</Text>

        {item.note ? (
          <>
            <Text style={styles.label}>Ghi chú:</Text>
            <Text style={styles.value}>{item.note}</Text>
          </>
        ) : null}

        <Text style={styles.label}>Trạng thái:</Text>
        <Text style={[styles.value, { color: item.status === 'accepted' ? 'green' : 'orange' }]}> 
          {item.status || 'pending'}
        </Text>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            disabled={item.status === 'accepted'}
            onPress={() => handleAccept(item.id)}>
            Xác nhận
          </Button>
          <Button
            mode="contained"
            style={{ marginLeft: 8 }}
            onPress={() => navigation.navigate('EditAppointmentScreen', { id: item.id })}>
            Chỉnh sửa
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
        <Appbar.Content title="QL Lịch Hẹn - Admin" />
      </Appbar.Header>

      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { marginBottom: 16 },
  label: { fontWeight: 'bold', fontSize: 14, marginTop: 8 },
  value: { fontSize: 15 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
});
