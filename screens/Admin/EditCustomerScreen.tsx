import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

export default function EditCustomerScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const doc = await firestore().collection('users').doc(id).get();
        if (doc.exists()) {
          const data = doc.data();
          setName(data?.name || '');
          setEmail(data?.email || '');
        } else {
          Alert.alert('Thông báo', 'Không tìm thấy người dùng.');
          navigation.goBack();
        }
      } catch (error: any) {
        Alert.alert('Lỗi', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await firestore().collection('users').doc(id).update({
        name,
        email,
        updatedAt: new Date().toISOString(),
      });
      Alert.alert('✅ Thành công', 'Đã cập nhật thông tin khách hàng.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('❌ Lỗi', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Cập nhật khách hàng" />
      </Appbar.Header>

      <View style={styles.form}>
        <Text style={styles.label}>Tên</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />

        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} />

        <Button mode="contained" onPress={handleUpdate}>
          Lưu thay đổi
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  label: { fontWeight: 'bold', fontSize: 14, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
});
