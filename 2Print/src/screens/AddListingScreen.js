import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config'; 
import axios from 'axios';

export default function AddListingScreen({ navigation }) {
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- 1. OPEN CAMERA ---
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera access to take photos of your cards.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'], // Modern Expo syntax
      allowsEditing: true,
      aspect: [3, 4], 
      quality: 0.5,
      base64: true, 
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  // --- 2. OPEN GALLERY ---
  const pickGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Modern Expo syntax
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  // --- 3. SUBMIT TO BACKEND ---
  const handlePost = async () => {
    if (!name || !price || !base64Image) {
      Alert.alert('Missing Info', 'Please add a photo, name, and price.');
      return;
    }

    setUploading(true);

    try {
      await axios.post(
        `${API_URL}/add-product`,
        {
          name: name,
          set: 'User Uploaded', // Fixed: Prevents MongoDB Validation Error
          game: game || 'Unknown Game',
          price: parseFloat(price),
          base64Image: base64Image,
          condition: 'Near Mint', 
          category: 'Single Card' 
        },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true' // Fixed: Bypasses Ngrok landing page
          }
        }
      );

      Alert.alert('Success', 'Card added to the marketplace!');
      navigation.goBack(); 
      
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      Alert.alert('Error', 'Failed to upload card. Check terminal for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Sell a Card</Text>

      <View style={styles.imageSection}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={50} color="#ccc" />
            <Text style={styles.placeholderText}>No photo selected</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.photoButtonText}>Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.photoButton, { backgroundColor: '#555' }]} onPress={pickGallery}>
            <Ionicons name="image" size={20} color="#fff" />
            <Text style={styles.photoButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Card Name</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Charizard Base Set" 
        value={name} 
        onChangeText={setName} 
      />

      <Text style={styles.label}>Game</Text>
      <TextInput 
        style={styles.input} 
        placeholder="e.g. Pokémon" 
        value={game} 
        onChangeText={setGame} 
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0.00" 
        keyboardType="numeric" 
        value={price} 
        onChangeText={setPrice} 
      />

      <TouchableOpacity 
        style={[styles.submitButton, uploading && { opacity: 0.7 }]} 
        onPress={handlePost} 
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>List Card</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  imageSection: { alignItems: 'center', marginBottom: 20 },
  previewImage: { width: 200, height: 280, borderRadius: 12, resizeMode: 'cover' },
  placeholder: { 
    width: 200, 
    height: 280, 
    backgroundColor: '#f0f0f0', 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#eee', 
    borderStyle: 'dashed' 
  },
  placeholderText: { color: '#888', marginTop: 10 },
  buttonRow: { flexDirection: 'row', marginTop: 15, gap: 10 },
  photoButton: { 
    flexDirection: 'row', 
    backgroundColor: '#007AFF', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    alignItems: 'center', 
    gap: 5 
  },
  photoButtonText: { color: '#fff', fontWeight: '600' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 8, 
    fontSize: 16, 
    marginBottom: 20, 
    backgroundColor: '#FAFAFA' 
  },
  submitButton: { 
    backgroundColor: '#000', 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 40 
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});