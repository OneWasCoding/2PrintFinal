import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if(!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // connecting to your backend
      await axios.post('http://172.34.89.80:5000/register', {
        username,
        email,
        password
      });
      
      Alert.alert("Success", "Account created! Please login.");
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert("Registration Failed", error.response?.data?.message || "Check your network connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' }}>
      <Title style={{ textAlign: 'center', marginBottom: 20 }}>Create Account</Title>
      
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={{ marginBottom: 10 }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={{ marginBottom: 20 }}
      />
      
      <Button mode="contained" onPress={handleRegister} loading={loading} disabled={loading}>
        Register
      </Button>
      
      <Button 
        mode="text" 
        onPress={() => navigation.navigate('Login')} 
        style={{ marginTop: 10 }}
      >
        Already have an account? Login
      </Button>
    </View>
  );
}