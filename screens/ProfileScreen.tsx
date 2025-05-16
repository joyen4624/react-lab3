import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

export default function ProfileScreen({ navigation }: any) {
  const user = auth().currentUser;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setName(user.displayName || '');
    }
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    try {
      await user.updateProfile({ displayName: name });
      Alert.alert('✅ Thành công', 'Thông tin đã được cập nhật.');
    } catch (error: any) {
      Alert.alert('❌ Lỗi', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Hồ sơ cá nhân" />
      </Appbar.Header>

      <View style={styles.form}>
        <Text>Email:</Text>
        <TextInput value={email} editable={false} style={styles.input} />

        <Text>Tên hiển thị:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên của bạn"
          style={styles.input}
        />

        <Button mode="contained" onPress={handleUpdate}>
          Cập nhật hồ sơ
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('ChangePassword')}
          style={{ marginTop: 12 }}
        >
          Đổi mật khẩu
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
});
