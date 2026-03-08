import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, Animated, Easing, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// --- COLORS ---
const COLORS = {
  primary: '#6200ee',
  primaryLight: '#7c4dff',
  primaryDark: '#4a00b4',
  accent: '#b388ff',
  gold: '#FFD700',
  magic: '#F2994A',
  pokemon: '#EF5350',
  yugioh: '#AB47BC',
  lorcana: '#29B6F6',
  background: '#1a1a2e',
  backgroundMid: '#16213e',
  backgroundLight: '#0f3460',
  card: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#888888',
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Animation refs
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
  const floatAnim4 = useRef(new Animated.Value(0)).current;
  const floatAnim5 = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  const cardPackPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating cards animation
    const createFloatAnim = (anim, delay, duration) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    createFloatAnim(floatAnim1, 0, 3500).start();
    createFloatAnim(floatAnim2, 500, 4000).start();
    createFloatAnim(floatAnim3, 1000, 3200).start();
    createFloatAnim(floatAnim4, 1500, 3800).start();
    createFloatAnim(floatAnim5, 2000, 3600).start();

    // Card pack pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(cardPackPulse, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cardPackPulse, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shine animation for button
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/login`, 
        { email: email.toLowerCase(), password },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true' 
          }
        }
      );
      await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('userToken', response.data.token);
      navigation.replace('Main');
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Interpolation functions for floating animations
  const interpolateY = (anim, range) => anim.interpolate({
    inputRange: [0, 1],
    outputRange: range,
  });

  const interpolateRotate = (anim, range) => anim.interpolate({
    inputRange: [0, 1],
    outputRange: range,
  });

  // Animated shine position
  const shineTranslate = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 400],
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      {/* Background Layer */}
      <View style={styles.background}>
        {/* Gradient overlay pattern */}
        <View style={styles.patternOverlay} />
        
        {/* Floating Trading Cards Background */}
        <Animated.View 
          style={[
            styles.floatingCard, 
            styles.card1,
            { 
              transform: [
                { translateY: interpolateY(floatAnim1, [0, -20]) },
                { rotate: '-15deg' }
              ] 
            }
          ]}
        >
          <View style={[styles.floatingCardInner, { backgroundColor: COLORS.magic }]} />
        </Animated.View>

        <Animated.View 
          style={[
            styles.floatingCard, 
            styles.card2,
            { 
              transform: [
                { translateY: interpolateY(floatAnim2, [0, -15]) },
                { rotate: '20deg' }
              ] 
            }
          ]}
        >
          <View style={[styles.floatingCardInner, { backgroundColor: COLORS.pokemon }]} />
        </Animated.View>

        <Animated.View 
          style={[
            styles.floatingCard, 
            styles.card3,
            { 
              transform: [
                { translateY: interpolateY(floatAnim3, [0, -25]) },
                { rotate: '10deg' }
              ] 
            }
          ]}
        >
          <View style={[styles.floatingCardInner, { backgroundColor: COLORS.yugioh }]} />
        </Animated.View>

        <Animated.View 
          style={[
            styles.floatingCard, 
            styles.card4,
            { 
              transform: [
                { translateY: interpolateY(floatAnim4, [0, -18]) },
                { rotate: '-25deg' }
              ] 
            }
          ]}
        >
          <View style={[styles.floatingCardInner, { backgroundColor: COLORS.lorcana }]} />
        </Animated.View>

        <Animated.View 
          style={[
            styles.floatingCard, 
            styles.card5,
            { 
              transform: [
                { translateY: interpolateY(floatAnim5, [0, -22]) },
                { rotate: '5deg' }
              ] 
            }
          ]}
        >
          <View style={[styles.floatingCardInner, { backgroundColor: COLORS.primary }]} />
        </Animated.View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        
        {/* Card Pack Logo */}
        <Animated.View style={[styles.cardPackContainer, { transform: [{ scale: cardPackPulse }] }]}>
          <View style={styles.cardPackGlow} />
          <View style={styles.cardPack}>
            <View style={styles.holoStrip} />
            <MaterialCommunityIcons name="star" size={18} color={COLORS.gold} style={styles.rarityStar} />
            <MaterialCommunityIcons name="cards" size={45} color="#fff" />
          </View>
        </Animated.View>

        {/* App Title */}
        <Text style={styles.appTitle}>2Print Market</Text>
        <Text style={styles.subtitle}>TRADE • COLLECT • COMPETE</Text>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardTypeIcon}>
              <MaterialCommunityIcons name="account-circle" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.cardTitleText}>Player Login</Text>
              <Text style={styles.cardSubtitle}>Access your card collection</Text>
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput 
              value={email} 
              onChangeText={setEmail} 
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              style={styles.input}
              mode="flat"
              autoCapitalize="none" 
              keyboardType="email-address"
              underlineColor="transparent"
              activeUnderlineColor={COLORS.primary}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput 
                value={password} 
                onChangeText={setPassword} 
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                style={styles.passwordInput}
                secureTextEntry={secureTextEntry}
                mode="flat"
                underlineColor="transparent"
                activeUnderlineColor={COLORS.primary}
              />
              <TouchableOpacity 
                style={styles.eyeButton} 
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              >
                <MaterialCommunityIcons 
                  name={secureTextEntry ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color={COLORS.textLight} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button with Holographic Effect */}
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {/* Animated shine overlay */}
            <Animated.View 
              style={[
                styles.shineOverlay, 
                { transform: [{ translateX: shineTranslate }] }
              ]} 
            />
            <Text style={styles.loginButtonText}>
              {loading ? 'ENTERING...' : 'ENTER'}
            </Text>
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity 
            style={styles.registerLink} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerLinkText}>
              Don't have a player card? <Text style={styles.registerHighlight}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Game Icons */}
        <View style={styles.footer}>
          <View style={styles.gameIcons}>
            <View style={[styles.gameBadge, { backgroundColor: COLORS.magic + '20' }]}>
              <MaterialCommunityIcons name="cards-playing-outline" size={18} color={COLORS.magic} />
            </View>
            <View style={[styles.gameBadge, { backgroundColor: COLORS.pokemon + '20' }]}>
              <MaterialCommunityIcons name="star-circle-outline" size={18} color={COLORS.pokemon} />
            </View>
            <View style={[styles.gameBadge, { backgroundColor: COLORS.yugioh + '20' }]}>
              <MaterialCommunityIcons name="eye-outline" size={18} color={COLORS.yugioh} />
            </View>
            <View style={[styles.gameBadge, { backgroundColor: COLORS.lorcana + '20' }]}>
              <MaterialCommunityIcons name="water-outline" size={18} color={COLORS.lorcana} />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Background
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.backgroundMid,
    opacity: 0.8,
  },

  // Floating Cards
  floatingCard: {
    position: 'absolute',
    width: 70,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  floatingCardInner: {
    flex: 1,
    opacity: 0.15,
  },
  card1: { top: '5%', right: '80%', width: 65, height: 90 },
  card2: { top: '18%', right: '5%', width: 55, height: 75 },
  card3: { top: '55%', right: '88%', width: 60, height: 85 },
  card4: { top: '70%', right: '8%', width: 70, height: 95 },
  card5: { top: '38%', right: '72%', width: 50, height: 70 },

  // Content
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Card Pack Logo
  cardPackContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardPackGlow: {
    position: 'absolute',
    width: 130,
    height: 170,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    opacity: 0.3,
    top: -5,
  },
  cardPack: {
    width: 120,
    height: 160,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  holoStrip: {
    position: 'absolute',
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.6)',
    top: '30%',
  },
  rarityStar: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  // Title
  appTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 30,
  },

  // Form Card
  formCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 24,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardTypeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Inputs
  inputWrapper: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    fontSize: 15,
    height: 50,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  eyeButton: {
    padding: 14,
  },

  // Login Button
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: [{ skewX: '-20deg' }],
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Register Link
  registerLink: {
    marginTop: 22,
    paddingVertical: 8,
  },
  registerLinkText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 14,
  },
  registerHighlight: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  // Footer
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  gameIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  gameBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

