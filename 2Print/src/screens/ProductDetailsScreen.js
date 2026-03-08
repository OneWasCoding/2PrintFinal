import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

// 1. Import your custom hook from the context file
import { useCart } from '../context/CartContext';

export default function ProductDetailsScreen({ route, navigation }) {
  // Grab the specific card that was tapped on the HomeScreen
  const { product } = route.params;

  // 2. Unpack the addToCart function directly from your global backpack!
  const { addToCart } = useCart();

  // 3. Wire it to a button press
  const handleAddToCart = () => {
    addToCart(product); 
    alert(`${product.name} has been added to your cart!`);
    
    // THE FIX: Tell it to go to the 'Main' tab navigator, and open the 'Cart' screen inside it
    navigation.navigate('Main', { screen: 'Cart' }); 
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.game}>{product.game}</Text>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
        <Text style={styles.condition}>Condition: {product.condition}</Text>

        {/* 4. Trigger the function when pressed */}
        <Button 
          mode="contained" 
          style={styles.button} 
          onPress={handleAddToCart}
        >
          Add to Cart
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 400, backgroundColor: '#f0f0f0' },
  detailsContainer: { padding: 20 },
  game: { color: '#888', textTransform: 'uppercase', marginBottom: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#27ae60', marginBottom: 15 },
  condition: { fontSize: 16, color: '#555', marginBottom: 20 },
  button: { marginTop: 10, paddingVertical: 5, borderRadius: 8 },
});