import React, { useState, useEffect } from 'react';
import { View, ScrollView, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Searchbar, Card, Chip, IconButton, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

// --- 1. IMPORT YOUR CONFIG ---
import { API_URL } from '../config';

const FALLBACK_PRODUCTS = [
  { _id: '1', name: 'Charizard Base Set', game: 'Pokémon', price: 250.00, condition: 'Lightly Played', image: 'https://images.pokemontcg.io/base1/4_hires.png' },
  { _id: '2', name: 'Black Lotus', game: 'Magic', price: 5000.00, condition: 'Mint', image: 'https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg' },
  { _id: '3', name: 'Blue-Eyes White Dragon', game: 'Yu-Gi-Oh!', price: 85.50, condition: 'Near Mint', image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg' },
  { _id: '4', name: 'The One Ring', game: 'Magic', price: 45.00, condition: 'Near Mint', image: 'https://cards.scryfall.io/large/front/8/b/8b4c6198-500b-4eb4-b6db-5dc0e1635398.jpg' },
];

const CATEGORIES = [
  { id: '1', name: 'Magic', icon: 'cards-playing-outline', color: '#F2994A' },
  { id: '2', name: 'Pokémon', icon: 'star-circle-outline', color: '#EF5350' },
  { id: '3', name: 'Yu-Gi-Oh!', icon: 'eye-outline', color: '#AB47BC' },
  { id: '4', name: 'Lorcana', icon: 'water-outline', color: '#29B6F6' },
];

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // --- 2. UPDATED TO USE API_URL ---
      const response = await axios.get(`${API_URL}/products`);
      if (response.data && response.data.length > 0) {
        setProducts(response.data);
      }
    } catch (error) {
      console.log("Using fallback data. Server error:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  // Function for Pull-to-Refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Surface style={[styles.categoryIconWrap, { backgroundColor: item.color + '15' }]} elevation={0}>
        <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
      </Surface>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium" style={{ color: '#666' }}>Welcome back,</Text>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#333' }}>Ready to trade?</Text>
        </View>
        <IconButton icon="bell-outline" size={28} iconColor="#333" />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6200ee']} />
        }
      >
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search cards, sets, or characters..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={{ minHeight: 45 }}
            elevation={1}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Shop by Game</Text>
            <Text variant="labelLarge" style={styles.seeAll}>See All</Text>
          </View>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 15, paddingRight: 5 }}
          />
        </View>

        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { marginLeft: 15, marginBottom: 15 }]}>
            Trending Singles
          </Text>
          
          <View style={styles.grid}>
            {products.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <Card 
                key={item._id} 
                style={styles.productCard} 
                onPress={() => navigation.navigate('ProductDetails', { product: item })}
              >
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
                </View>
                <Card.Content style={styles.cardContent}>
                  <Text variant="labelSmall" style={styles.gameTag}>{item.game}</Text>
                  <Text variant="titleSmall" numberOfLines={2} style={styles.cardTitle}>{item.name}</Text>
                  
                  <View style={styles.priceRow}>
                    <Text variant="titleMedium" style={styles.priceText}>${item.price?.toFixed(2)}</Text>
                    <Chip textStyle={{ fontSize: 9 }} style={styles.conditionChip} compact>
                      {item.condition}
                    </Chip>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  searchContainer: { paddingHorizontal: 15, marginBottom: 20 },
  searchBar: { backgroundColor: '#FFFFFF', borderRadius: 12 },
  section: { marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom: 15 },
  sectionTitle: { fontWeight: 'bold', color: '#111' },
  seeAll: { color: '#6200ee', fontWeight: 'bold' },
  categoryCard: { alignItems: 'center', marginRight: 15 },
  categoryIconWrap: { width: 60, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryText: { fontSize: 13, fontWeight: '600', color: '#444' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 15 },
  productCard: { width: '48%', marginBottom: 15, backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', elevation: 2 },
  imageWrapper: { backgroundColor: '#f0f0f0', padding: 10, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  cardImage: { width: '100%', height: 130 },
  cardContent: { padding: 12 },
  gameTag: { color: '#888', textTransform: 'uppercase', marginBottom: 2 },
  cardTitle: { fontWeight: 'bold', color: '#222', height: 40, lineHeight: 18 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  priceText: { color: '#27ae60', fontWeight: 'bold' },
  conditionChip: { backgroundColor: '#e8f5e9', height: 20, justifyContent: 'center' },
});