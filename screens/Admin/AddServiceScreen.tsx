import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function AddServiceScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleAddService = async () => {
    if (!name || !price) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      const now = new Date();
      await firestore().collection('services').add({
        name,
        price: parseInt(price),
        creator: auth().currentUser?.email || 'admin',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });

      Alert.alert('Thành công', 'Đã thêm dịch vụ mới.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Thêm Dịch Vụ" />
      </Appbar.Header>

      <View style={styles.form}>
        <Text style={styles.label}>Tên dịch vụ</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên dịch vụ"
        />

        <Text style={styles.label}>Giá</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="Nhập giá dịch vụ"
        />

        <Button mode="contained" onPress={handleAddService} style={styles.button}>
          Thêm dịch vụ
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  label: { fontSize: 16, marginBottom: 6, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  button: { marginTop: 10 },
});
