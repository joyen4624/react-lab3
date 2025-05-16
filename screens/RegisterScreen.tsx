import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setDebugLog(prev => [...prev, msg]);
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    try {
      setLoading(true);
      addLog(`📨 Bắt đầu đăng ký với email: ${email}`);

      const auth = getAuth(getApp());
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      addLog(`✅ Tạo tài khoản thành công: ${uid}`);

      // 🔥 Ghi thông tin người dùng vào Firestore
      await firestore()
        .collection('users')
        .doc(uid)
        .set(
          {
            email,
            role: 'user', // mặc định là user
            createdAt: new Date().toISOString(),
          },
          { merge: true } // tránh ghi đè nếu đã có
        );

      addLog('✅ Đã ghi thông tin user vào Firestore');
      Alert.alert('Thành công', 'Tài khoản đã được tạo!');
      setLoading(false);

      setTimeout(() => navigation.navigate('Login'), 1000);
    } catch (error: any) {
      setLoading(false);
      addLog(`❌ Lỗi đăng ký: ${error.message}`);
      Alert.alert('Lỗi', error.message || 'Đăng ký thất bại');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Đăng ký tài khoản</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
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

        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#d32f2f" />
        ) : (
          <Button title="Tạo tài khoản" onPress={handleSignUp} />
        )}

        <Text style={styles.debugTitle}>🪵 Log đăng ký:</Text>
        {debugLog.map((line, index) => (
          <Text key={index} style={styles.debugLine}>• {line}</Text>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 24,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  debugTitle: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#444',
  },
  debugLine: {
    fontSize: 14,
    color: '#666',
  },
});
