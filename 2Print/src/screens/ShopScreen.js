import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; // <--- The important part

export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <Text>Shop Screen (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});