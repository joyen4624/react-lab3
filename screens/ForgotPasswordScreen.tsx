import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>;
};

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const auth = getAuth(getApp());

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Thông báo', 'Vui lòng nhập email');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Thành công', 'Email khôi phục đã được gửi!');
        navigation.goBack();
      })
      .catch(err => Alert.alert('Lỗi', err.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên Mật Khẩu</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập email đã đăng ký"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Gửi Email Khôi Phục" onPress={handleResetPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
});
