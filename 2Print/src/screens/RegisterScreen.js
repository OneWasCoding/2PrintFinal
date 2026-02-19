import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Make sure this matches your PC's IP address!
      await axios.post('http://10.134.52.235:5000/register', { username, email, password });
      alert("Success! You can now log in.");
      navigation.navigate('Login');
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
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
        <MaterialCommunityIcons name="account-plus" size={80} color="#6200ee" />
        <Title style={styles.appTitle}>Create Account</Title>
      </View>

      <Surface style={styles.formContainer} elevation={4}>
        <TextInput 
          label="Username" 
          value={username} 
          onChangeText={setUsername} 
          mode="outlined" 
          style={styles.input} 
          autoCapitalize="none" 
        />
        <TextInput 
          label="Email Address" 
          value={email} 
          onChangeText={setEmail} 
          mode="outlined" 
          style={styles.input} 
          autoCapitalize="none" 
          keyboardType="email-address" 
        />
        <TextInput 
          label="Password" 
          value={password} 
          onChangeText={setPassword} 
          mode="outlined" 
          secureTextEntry 
          style={styles.input} 
        />
        
        <Button 
          mode="contained" 
          onPress={handleRegister} 
          loading={loading} 
          disabled={loading} 
          style={styles.button}
          contentStyle={{ height: 50 }}
        >
          Register
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={{fontWeight: 'bold', color: '#6200ee'}}>Sign In</Text>
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