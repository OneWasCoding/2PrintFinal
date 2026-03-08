import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native'; 
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';

// 1. IMPORT YOUR NEW CART PROVIDER
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <PaperProvider>
      {/* 2. WRAP THE APP IN YOUR CART PROVIDER */}
      <CartProvider>
        <View style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <AppNavigator />
        </View>
      </CartProvider>
    </PaperProvider>
  );
}