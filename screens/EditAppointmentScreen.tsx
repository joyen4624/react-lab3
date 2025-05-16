import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';

export default function EditAppointmentScreen({ route, navigation }: any) {
  const { appointment } = route.params;
  const [date, setDate] = useState(new Date(`${appointment.date} ${appointment.time}`));
  const [note, setNote] = useState(appointment.note || '');
  const [showPicker, setShowPicker] = useState(false);

  const handleUpdate = async () => {
    try {
      await firestore().collection('appointments').doc(appointment.id).update({
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        note,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert('✅ Thành công', 'Lịch hẹn đã được cập nhật.');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('❌ Lỗi', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.title}>Chỉnh sửa lịch hẹn</Text>

      <Button mode="outlined" onPress={() => setShowPicker(true)}>
        Chọn ngày & giờ
      </Button>
      <Text style={styles.datetime}>{date.toLocaleDateString()} - {date.toLocaleTimeString()}</Text>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TextInput
        placeholder="Ghi chú"
        style={styles.input}
        value={note}
        onChangeText={setNote}
      />

      <Button mode="contained" onPress={handleUpdate}>
        Cập nhật lịch hẹn
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  datetime: { fontSize: 16, marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 16,
  },
});
