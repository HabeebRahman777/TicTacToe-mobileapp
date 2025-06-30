import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import {instance} from '../utils/api';
import { storeToken,storeUser } from '../utils/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      
      const res = await instance.post('auth/login', { email, password });
      
      await storeToken(res.data.token);
      await storeUser(res.data.user)
      
      navigation.replace('Lobby');

    } catch (err) {
      Alert.alert('Login Failed', err?.response?.data?.message || 'Server Error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
      <Button title="Login" onPress={login} />
      <Text onPress={() => navigation.navigate('Register')} style={styles.link}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 5 },
  link: { marginTop: 15, color: 'blue' },
});
