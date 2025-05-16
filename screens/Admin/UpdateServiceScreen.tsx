import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

export default function UpdateServiceScreen({ route, navigation }: any) {
  const { serviceId } = route.params;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const loadService = async () => {
      const doc = await firestore().collection('services').doc(serviceId).get();
      if (doc.exists()) {
        const data = doc.data();
        setName(data?.name || '');
        setPrice(data?.price?.toString() || '');
      } else {
        Alert.alert('Không tìm thấy dịch vụ');
        navigation.goBack();
      }
    };
    loadService();
  }, [serviceId]);

  const handleUpdate = async () => {
    if (!name || !price) return Alert.alert('Vui lòng nhập đầy đủ');

    await firestore().collection('services').doc(serviceId).update({
      name,
      price: parseInt(price),
      updatedAt: new Date().toISOString(),
    });

    Alert.alert('✅ Đã cập nhật dịch vụ!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Cập nhật dịch vụ" />
      </Appbar.Header>

      <TextInput
        style={styles.input}
        placeholder="Tên dịch vụ"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />

      <Button mode="contained" onPress={handleUpdate}>
        Lưu thay đổi
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    borderRadius: 8,
    padding: 10,
  },
});
