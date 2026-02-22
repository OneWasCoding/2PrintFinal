import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Button, Surface, IconButton, Divider } from 'react-native-paper';

// Temporary dummy data until we link the global state!
const DUMMY_CART = [
  { _id: '1', name: 'Charizard Base Set', game: 'Pokémon', price: 250.00, image: 'https://images.pokemontcg.io/base1/4_hires.png', quantity: 1 },
  { _id: '4', name: 'The One Ring', game: 'Magic', price: 45.00, image: 'https://cards.scryfall.io/large/front/8/b/8b4c6198-500b-4eb4-b6db-5dc0e1635398.jpg', quantity: 1 },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(DUMMY_CART);

  // Removes the item from the screen when the trash can is clicked
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  // Automatically adds up the prices
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // What to show if the cart is completely empty
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#333' }}>Your cart is empty</Text>
        <Text variant="bodyMedium" style={{ color: '#666', marginTop: 10 }}>Time to hunt for some rare cards!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="headlineMedium" style={styles.headerTitle}>Your Cart</Text>
        
        {/* Mapping through our cart items to generate cards */}
        {cartItems.map((item) => (
          <Surface key={item._id} style={styles.cartItem} elevation={2}>
            <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
            
            <View style={styles.itemDetails}>
              <Text variant="labelSmall" style={styles.gameTag}>{item.game}</Text>
              <Text variant="titleMedium" numberOfLines={1} style={styles.itemName}>{item.name}</Text>
              <Text variant="titleMedium" style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>

            <IconButton 
              icon="delete-outline" 
              iconColor="#EF5350" 
              size={24} 
              onPress={() => handleRemoveItem(item._id)} 
            />
          </Surface>
        ))}

        {/* Pricing Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text variant="titleMedium" style={styles.summaryText}>Subtotal</Text>
            <Text variant="titleMedium" style={styles.summaryText}>${calculateTotal()}</Text>
          </View>
          <Divider style={{ marginVertical: 10 }} />
          <View style={styles.summaryRow}>
            <Text variant="titleLarge" style={styles.totalText}>Total</Text>
            <Text variant="titleLarge" style={styles.totalAmount}>${calculateTotal()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Checkout Button at the bottom */}
      <View style={styles.checkoutFooter}>
        <Button 
          mode="contained" 
          style={styles.checkoutButton} 
          contentStyle={{ height: 55 }}
          onPress={() => alert('Proceeding to Checkout!')}
        >
          Checkout (${calculateTotal()})
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' },
  headerTitle: { fontWeight: 'bold', margin: 20, color: '#111' },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginHorizontal: 20, marginBottom: 15, padding: 10, borderRadius: 12 },
  itemImage: { width: 60, height: 80, borderRadius: 6, backgroundColor: '#f0f0f0' },
  itemDetails: { flex: 1, marginLeft: 15 },
  gameTag: { color: '#888', textTransform: 'uppercase' },
  itemName: { fontWeight: 'bold', color: '#333', marginBottom: 4 },
  itemPrice: { color: '#27ae60', fontWeight: 'bold' },
  summaryContainer: { marginHorizontal: 20, marginTop: 10, padding: 20, backgroundColor: 'white', borderRadius: 12, elevation: 1 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryText: { color: '#555' },
  totalText: { fontWeight: 'bold', color: '#111' },
  totalAmount: { fontWeight: 'bold', color: '#27ae60' },
  checkoutFooter: { padding: 20, backgroundColor: 'white', elevation: 10, borderTopWidth: 1, borderColor: '#eee' },
  checkoutButton: { borderRadius: 12 },
});