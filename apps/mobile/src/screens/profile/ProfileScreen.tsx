import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/auth.slice';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => dispatch(logout())}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6', padding: 20, justifyContent: 'center' },
  header: { backgroundColor: '#ffffff', borderRadius: 8, padding: 20, marginBottom: 20 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#1f2937' },
  email: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  button: { backgroundColor: '#ef4444', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
