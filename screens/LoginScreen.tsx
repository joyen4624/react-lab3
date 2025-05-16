import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<any>;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      console.log('🚀 Đang đăng nhập với:', email);

      // 🔐 Đăng nhập Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      console.log('✅ Đăng nhập Firebase Auth thành công:', uid);

      // 🔍 Lấy thông tin role từ Firestore
      const userDoc = await firestore().collection('users').doc(uid).get();

      if (userDoc.exists()) {
        const data = userDoc.data();
        const role = data?.role;

        console.log('📦 Role:', role);

        if (role === 'admin') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AdminHome' }], // ⚠️ Tên màn hình admin bạn đã cấu hình trong navigator
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }], // ⚠️ Màn hình chính cho user
          });
        }
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng!');
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log('❌ Lỗi đăng nhập:', error.message);
      Alert.alert('Lỗi', error.message || 'Không thể đăng nhập');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kami Spa App</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgot}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#d32f2f" />
      ) : (
        <Button title="Đăng nhập" onPress={handleSignIn} />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Đăng ký" color="blue" onPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, flex: 1, justifyContent: 'center' },
  title: { fontSize: 26, textAlign: 'center', marginBottom: 20, color: 'red' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
  },
  forgot: { color: 'blue', textAlign: 'right', marginBottom: 12 },
});
