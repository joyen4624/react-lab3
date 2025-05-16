import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Appbar } from 'react-native-paper';

export default function ServiceDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const doc = await firestore().collection('services').doc(id).get();
        if (doc.exists()) {
          setService({ id: doc.id, ...doc.data() });
        } else {
          Alert.alert('Thông báo', 'Không tìm thấy dịch vụ.');
          navigation.goBack();
        }
      } catch (error: any) {
        Alert.alert('Lỗi', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f05a72" />
      </View>
    );
  }

  if (!service) return null;

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Chi tiết dịch vụ" />
      </Appbar.Header>

      <View style={styles.content}>
        <Text style={styles.label}>Tên dịch vụ:</Text>
        <Text style={styles.value}>{service.name}</Text>

        <Text style={styles.label}>Giá:</Text>
        <Text style={styles.value}>{service.price?.toLocaleString()} đ</Text>

        <Text style={styles.label}>Người tạo:</Text>
        <Text style={styles.value}>{service.creator || 'Chưa rõ'}</Text>

        <Text style={styles.label}>Thời gian tạo:</Text>
        <Text style={styles.value}>{new Date(service.createdAt).toLocaleString()}</Text>

        <Text style={styles.label}>Cập nhật lần cuối:</Text>
        <Text style={styles.value}>{new Date(service.updatedAt).toLocaleString()}</Text>
      </View>

      <View style={styles.buttonBox}>
        <Button
          title="Đặt lịch hẹn"
          color="#f05a72"
          onPress={() => navigation.navigate('CreateAppointment', { service })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  label: { fontWeight: 'bold', fontSize: 15, marginTop: 10 },
  value: { fontSize: 15, marginTop: 2, color: '#444' },
  buttonBox: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 12,
  },
});
