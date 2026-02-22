import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Avatar, Button, Surface, List, Divider, TextInput, Dialog, Portal } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState({ username: "Loading...", email: "..." });
  const [loading, setLoading] = useState(false);

  // Dialog Visibilities
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  // Form States
  const [editUsername, setEditUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true); // Eye toggle state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setEditUsername(parsedUser.username);
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/update-profile`, { 
        email: user.email, 
        newUsername: editUsername 
      });
      const updatedUser = { ...user, username: editUsername };
      setUser(updatedUser);
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setEditProfileVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Error", "Please fill in all password fields.");
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API_URL}/change-password`, { 
        email: user.email, 
        currentPassword, 
        newPassword 
      });
      setPasswordVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      Alert.alert("Success", "Password changed successfully!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Incorrect current password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userInfo');
    await AsyncStorage.removeItem('userToken');
    Alert.alert("Logged Out", "You have been safely logged out.");
    navigation.replace('Login');
  };

  // --- NEW: DELETE ACCOUNT FUNCTION ---
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you absolutely sure? This will permanently remove your data from our database.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            setLoading(true);
            try {
              // Note: axios.delete requires data to be passed in a 'data' object
              await axios.delete(`${API_URL}/delete-account`, { data: { email: user.email } });
              await AsyncStorage.multiRemove(['userInfo', 'userToken']);
              Alert.alert("Account Deleted", "Your profile has been removed.");
              navigation.replace('Login');
            } catch (error) {
              Alert.alert("Error", "Could not delete account. Try again later.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Surface style={styles.headerSurface} elevation={2}>
          <Avatar.Icon size={80} icon="account" style={{ backgroundColor: '#6200ee' }} />
          <Text variant="headlineSmall" style={styles.nameText}>{user.username}</Text>
          <Text variant="bodyMedium" style={styles.emailText}>{user.email}</Text>
        </Surface>

        <View style={styles.menuContainer}>
          <List.Section>
            <List.Item
              title="Edit Profile"
              left={props => <List.Icon {...props} icon="account-edit" color="#6200ee" />}
              onPress={() => setEditProfileVisible(true)}
            />
            <Divider />
            <List.Item
              title="Change Password"
              left={props => <List.Icon {...props} icon="lock-reset" color="#F2994A" />}
              onPress={() => setPasswordVisible(true)}
            />
          </List.Section>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Button 
            mode="contained-tonal" 
            icon="logout" 
            onPress={handleLogout}
            style={styles.actionButton}
            buttonColor="#f3e5f5"
            textColor="#6200ee"
          >
            Log Out
          </Button>

          <Button 
            mode="text" 
            icon="account-remove" 
            onPress={handleDeleteAccount}
            style={[styles.actionButton, { marginTop: 10 }]}
            textColor="#d32f2f"
          >
            Delete Account Permanently
          </Button>
        </View>
      </ScrollView>

      {/* DIALOGS */}
      <Portal>
        <Dialog visible={isEditProfileVisible} onDismiss={() => setEditProfileVisible(false)} style={styles.dialog}>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Username" value={editUsername} onChangeText={setEditUsername} mode="outlined" style={styles.input} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditProfileVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleSaveProfile} loading={loading}>Save</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={isPasswordVisible} onDismiss={() => setPasswordVisible(false)} style={styles.dialog}>
          <Dialog.Title>Change Password</Dialog.Title>
          <Dialog.Content>
            <TextInput 
              label="Current Password" 
              value={currentPassword} 
              onChangeText={setCurrentPassword} 
              mode="outlined" 
              secureTextEntry={secureTextEntry} 
              style={styles.input}
              right={<TextInput.Icon icon={secureTextEntry ? "eye" : "eye-off"} onPress={() => setSecureTextEntry(!secureTextEntry)} />}
            />
            <TextInput 
              label="New Password" 
              value={newPassword} 
              onChangeText={setNewPassword} 
              mode="outlined" 
              secureTextEntry={secureTextEntry} 
              style={styles.input} 
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPasswordVisible(false)}>Cancel</Button>
            <Button mode="contained" onPress={handleChangePassword} loading={loading} buttonColor="#F2994A">Update</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  headerSurface: { alignItems: 'center', paddingVertical: 30, backgroundColor: 'white', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 4 },
  nameText: { fontWeight: 'bold', color: '#333', marginTop: 15 },
  emailText: { color: '#666', marginTop: 5 },
  menuContainer: { marginTop: 20, marginHorizontal: 15, backgroundColor: 'white', borderRadius: 15, elevation: 1, overflow: 'hidden' },
  actionButton: { borderRadius: 12, height: 50, justifyContent: 'center' },
  dialog: { backgroundColor: 'white', borderRadius: 15 },
  input: { marginBottom: 10, backgroundColor: 'white' }
});