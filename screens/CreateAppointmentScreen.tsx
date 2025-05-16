import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function CreateAppointmentScreen({ route, navigation }: any) {
  const { service } = route.params;
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState('');

  const handleConfirm = async () => {
    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Thông báo', 'Vui lòng đăng nhập!');
      return;
    }

    try {
      await firestore().collection('appointments').add({
        userId: user.uid,
        userEmail: user.email || '',
        serviceId: service.id,
        serviceName: service.name,
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        note,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('✅ Thành công', 'Bạn đã đặt lịch hẹn!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('❌ Lỗi', err.message || 'Không thể đặt lịch.');
    }
  };

  const onChangeDate = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const updated = new Date(date);
      updated.setFullYear(selectedDate.getFullYear());
      updated.setMonth(selectedDate.getMonth());
      updated.setDate(selectedDate.getDate());
      setDate(updated);
    }
  };

  const onChangeTime = (_: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const updated = new Date(date);
      updated.setHours(selectedTime.getHours());
      updated.setMinutes(selectedTime.getMinutes());
      setDate(updated);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lịch: {service.name}</Text>

      <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.button}>
        Chọn ngày
      </Button>

      <Button mode="outlined" onPress={() => setShowTimePicker(true)} style={styles.button}>
        Chọn giờ
      </Button>

      <Text style={styles.datetime}>
        {date.toLocaleDateString()} - {date.toLocaleTimeString()}
      </Text>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeTime}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Ghi chú (nếu có)"
        value={note}
        onChangeText={setNote}
      />

      <Button mode="contained" onPress={handleConfirm}>
        Xác nhận đặt lịch
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  button: { marginVertical: 8 },
  datetime: { marginVertical: 12, fontSize: 16, color: '#444' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 16,
  },
});
