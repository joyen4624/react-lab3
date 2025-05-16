import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

export default function ChangePasswordScreen({ navigation }: any) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    const user = auth().currentUser;
    if (!user || !user.email) {
      Alert.alert('Lỗi', 'Không tìm thấy người dùng.');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ các trường.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp.');
      return;
    }

    try {
      const cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(cred);
      await user.updatePassword(newPassword);
      Alert.alert('✅ Thành công', 'Đã đổi mật khẩu.');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('❌ Lỗi', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#f05a72' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Đổi mật khẩu" />
      </Appbar.Header>

      <View style={styles.form}>
        <TextInput
          placeholder="Mật khẩu hiện tại"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button mode="contained" onPress={handleChangePassword}>
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
