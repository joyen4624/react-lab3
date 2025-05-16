import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Appbar, Button } from 'react-native-paper';

export default function AppointmentsScreen({ navigation }: any) {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('appointments')
      .where('userId', '==', user.uid)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(data);
      });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá lịch hẹn này?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await firestore().collection('appointments').doc(id).delete();
        },
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.serviceName}</Text>
        <Text style={styles.detail}>Ngày: {item.date}</Text>
        <Text style={styles.detail}>Giờ: {item.time}</Text>
        {item.note ? <Text style={styles.detail}>Ghi chú: {item.note}</Text> : null}
      </View>
      <View style={styles.actions}>
        <Button compact onPress={() => navigation.navigate('EditAppointment', { appointment: item })}>Sửa</Button>
        <Button compact color="red" onPress={() => handleDelete(item.id)}>Xoá</Button>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Lịch hẹn của tôi" />
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
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  detail: { fontSize: 14, color: '#555', marginTop: 4 },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
});
