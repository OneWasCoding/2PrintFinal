import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Replace with your IPv4 Address
      const response = await axios.post('http://10.134.52.235:5000/login', {
        email,
        password
      });
      console.log("Login Success", response.data);
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
        <MaterialCommunityIcons name="cards-playing" size={80} color="#6200ee" />
        <Title style={styles.appTitle}>2Print Market</Title>
        <Text style={styles.subtitle}>Buy, Sell, Trade TCG</Text>
      </View>

      <Surface style={styles.formContainer} elevation={4}>
        <TextInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          left={<TextInput.Icon icon="email" />}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          left={<TextInput.Icon icon="lock" />}
          right={<TextInput.Icon icon="eye" />}
          secureTextEntry
          style={styles.input}
        />
        
        <Button 
          mode="contained" 
          onPress={handleLogin} 
          loading={loading} 
          disabled={loading}
          style={styles.button}
          contentStyle={{ height: 50 }}
        >
          Sign In
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>New here? <Text style={{fontWeight: 'bold', color: '#6200ee'}}>Create Account</Text></Text>
        </TouchableOpacity>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  appTitle: { fontSize: 32, fontWeight: 'bold', color: '#333', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#666' },
  formContainer: { marginHorizontal: 20, padding: 25, borderRadius: 15, backgroundColor: 'white' },
  input: { marginBottom: 15, backgroundColor: 'white' },
  button: { marginTop: 10, borderRadius: 8 },
  linkText: { marginTop: 20, textAlign: 'center', color: '#555' },
});