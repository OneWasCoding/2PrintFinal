import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, Text, Title, Surface } from 'react-native-paper';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import your API config
import { API_URL } from '../config';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- NEW STATE FOR PASSWORD VISIBILITY ---
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleRegister = async () => {
    setLoading(true);
    try {
      // 1. Create the account in your MongoDB database
      await axios.post(`${API_URL}/register`, { username, email, password });
      
      // 2. Show a success alert
      Alert.alert("Success!", "Account created successfully. Please log in.");
      
      // 3. Send them back to the Login screen
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Registration failed");
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