import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Button, Surface, Chip, Divider } from 'react-native-paper';

export default function ProductDetailsScreen({ route, navigation }) {
  // This catches the 'item' data we will send from the Home Screen
  const { product } = route.params;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        {/* We use resizeMode="contain" so the trading card doesn't get cropped */}
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>
      
      <Surface style={styles.detailsContainer} elevation={4}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text variant="labelMedium" style={styles.gameText}>{product.game}</Text>
            <Text variant="headlineSmall" style={styles.title}>{product.name}</Text>
          </View>
          <Chip icon="check-decagram" style={styles.conditionChip} textStyle={{ fontSize: 12 }}>
            {product.condition}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.priceRow}>
          <Text variant="displaySmall" style={styles.price}>${product.price?.toFixed(2)}</Text>
          <Text variant="bodySmall" style={styles.stock}>Ships from local seller</Text>
        </View>

        <Text variant="bodyMedium" style={styles.description}>
          {product.description || "A beautiful listing ready for your collection or next deck build. Securely packaged and shipped."}
        </Text>

        <Button 
          mode="contained" 
          icon="cart-plus" 
          onPress={() => alert(`${product.name} added to cart!`)} 
          style={styles.button}
          contentStyle={{ height: 55 }}
        >
          Add to Cart
        </Button>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  imageContainer: { width: '100%', height: 400, backgroundColor: '#e0e0e0', padding: 20 },
  image: { flex: 1, width: '100%', height: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  detailsContainer: { flex: 1, marginTop: -20, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, backgroundColor: 'white' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  gameText: { color: '#6200ee', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  title: { fontWeight: 'bold', color: '#333' },
  conditionChip: { backgroundColor: '#e8f5e9', alignSelf: 'flex-start' },
  divider: { marginVertical: 20 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  price: { color: '#27ae60', fontWeight: 'bold' },
  stock: { color: '#666', marginBottom: 8 },
  description: { color: '#555', lineHeight: 22, marginBottom: 30 },
  button: { borderRadius: 12, elevation: 2 },
});