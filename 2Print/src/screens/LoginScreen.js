import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // --- NEW STATE FOR PASSWORD VISIBILITY ---
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('userToken', response.data.token);
      navigation.replace('Main');
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="cards-outline" size={80} color="#6200ee" />
        <Title style={styles.appTitle}>2Print Market</Title>
      </View>

      <Surface style={styles.formContainer} elevation={4}>
        <TextInput 
          label="Email Address" 
          value={email} 
          onChangeText={setEmail} 
          mode="outlined" 
          style={styles.input} 
          autoCapitalize="none" 
          keyboardType="email-address" 
        />
        
        {/* --- PASSWORD FIELD WITH EYE ICON --- */}
        <TextInput 
          label="Password" 
          value={password} 
          onChangeText={setPassword} 
          mode="outlined" 
          secureTextEntry={secureTextEntry} 
          style={styles.input} 
          right={
            <TextInput.Icon 
              icon={secureTextEntry ? "eye" : "eye-off"} 
              onPress={() => setSecureTextEntry(!secureTextEntry)} 
            />
          }
        />
        
        <Button 
          mode="contained" 
          onPress={handleLogin} 
          loading={loading} 
          disabled={loading} 
          style={styles.button}
          contentStyle={{ height: 50 }}
        >
          Login
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={{fontWeight: 'bold', color: '#6200ee'}}>Register</Text>
          </Text>
        </TouchableOpacity>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  appTitle: { fontSize: 32, fontWeight: 'bold', color: '#333', marginTop: 10 },
  formContainer: { marginHorizontal: 20, padding: 25, borderRadius: 15, backgroundColor: 'white' },
  input: { marginBottom: 15, backgroundColor: 'white' },
  button: { marginTop: 10, borderRadius: 8 },
  linkText: { marginTop: 20, textAlign: 'center', color: '#555' },
});