import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import api, { setToken } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { mobile_number: mobile, password });
      setToken(response.data.token);
      navigation.replace('Dashboard', { user: response.data.user });
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pipeline Patrol</Text>
      <TextInput style={styles.input} placeholder="Mobile number" keyboardType="phone-pad" onChangeText={setMobile} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <Button title="Login" onPress={handleLogin} />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  error: { color: 'red', marginTop: 8 },
});
