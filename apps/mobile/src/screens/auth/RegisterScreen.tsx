import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { login } from '../../redux/slices/auth.slice';

export default function RegisterScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !organization) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    try {
      const registrationData = {
        firstName,
        lastName,
        email,
        password,
        organizationName: organization,
      };

      // In a real app, this would call a registration API
      // For now, we'll simulate it by logging in
      await dispatch(login({ email, password }));

      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('Dashboard');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Please try again');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>FLANDERS OS</Text>
      <Text style={styles.subtitle}>Create Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Organization"
        value={organization}
        onChangeText={setOrganization}
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Creating Account...' : 'Create Account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#6b7280',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    color: '#3b82f6',
    fontSize: 14,
  },
});
