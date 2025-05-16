import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button, Menu } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditAppointmentScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [appointment, setAppointment] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('pending');
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const doc = await firestore().collection('appointments').doc(id).get();
        if (doc.exists()) {
          const data = doc.data();
          setAppointment(data);
          setDate(new Date(`${data?.date} ${data?.time}`));
          setNote(data?.note || '');
          setStatus(data?.status || 'pending');
        } else {
          Alert.alert('Không tìm thấy lịch hẹn');
          navigation.goBack();
        }
      } catch (err: any) {
        Alert.alert('Lỗi', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await firestore().collection('appointments').doc(id).update({
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        note,
        status,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert('✅ Cập nhật thành công');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('❌ Lỗi', err.message);
    }
  };

  if (loading || !appointment) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f05a72" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cập nhật lịch hẹn</Text>

      <Text style={styles.label}>Dịch vụ:</Text>
      <Text style={styles.value}>{appointment.serviceName}</Text>

      <Text style={styles.label}>Chọn ngày & giờ:</Text>
      <Button mode="outlined" onPress={() => setShowPicker(true)} style={styles.button}>
        {date.toLocaleDateString()} - {date.toLocaleTimeString()}
      </Button>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          is24Hour={true}
          onChange={(_, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Trạng thái:</Text>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.button}
          >
            {status === 'confirmed'
              ? '✅ Đã xác nhận'
              : status === 'cancelled'
              ? '❌ Đã hủy'
              : '⏳ Đang chờ'}
          </Button>
        }
      >
        <Menu.Item onPress={() => { setStatus('pending'); setMenuVisible(false); }} title="⏳ Đang chờ" />
        <Menu.Item onPress={() => { setStatus('confirmed'); setMenuVisible(false); }} title="✅ Đã xác nhận" />
        <Menu.Item onPress={() => { setStatus('cancelled'); setMenuVisible(false); }} title="❌ Đã hủy" />
      </Menu>

      <Text style={styles.label}>Ghi chú:</Text>
      <TextInput
        style={styles.input}
        value={note}
        onChangeText={setNote}
        placeholder="Ghi chú thêm..."
        multiline
      />

      <Button mode="contained" onPress={handleUpdate} style={styles.saveBtn}>
        Lưu thay đổi
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#f05a72',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#444',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    marginBottom: 12,
  },
  saveBtn: {
    marginTop: 10,
    backgroundColor: '#f05a72',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
