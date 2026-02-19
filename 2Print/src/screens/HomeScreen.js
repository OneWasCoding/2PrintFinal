import React, { useState, useEffect } from 'react';
// 1. Double check this line. View MUST be imported from 'react-native'
import { View, ScrollView, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Text, Searchbar, Card, Chip, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { CATEGORIES } from '../data/mockData';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

const fetchProducts = async () => {
    try {
      // Make sure your IP is still correct here!
      const response = await axios.get('http://10.134.52.235:5000/products');
      
      // SPY 1: See what the server actually sent back
      console.log("SERVER RESPONSE:", response.data); 
      
      setProducts(response.data);
    } catch (error) {
      // SPY 2: Catch any network crashes
      console.error("FETCH ERROR:", error.message); 
    } finally {
      setLoading(false);
    }
  };
  // --- Helper Components defined INSIDE to ensure Scope Safety ---
  const renderCategory = ({ item }) => (
    <View style={styles.categoryItem}>
      <View style={[styles.categoryCircle, { backgroundColor: item.color + '20' }]}>
        <MaterialCommunityIcons name={item.icon} size={32} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </View>
  );

  const renderCardItem = ({ item }) => (
    <Card style={styles.cardItem} onPress={() => navigation.navigate('ProductDetails', { product: item })}>
      <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
      <Card.Content style={{ padding: 10 }}>
        <Text variant="labelSmall" style={{ color: '#666' }}>{item.game}</Text>
        <Text variant="titleMedium" numberOfLines={1} style={{ fontWeight: 'bold' }}>{item.name}</Text>
        
        <View style={styles.priceRow}>
          <Text variant="titleMedium" style={{ color: '#27ae60', fontWeight: 'bold' }}>
            ${item.price?.toFixed(2)}
          </Text>
          <Chip textStyle={{ fontSize: 10, height: 16, lineHeight: 16 }} style={{ height: 24 }}>
            {item.condition}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Searchbar
          placeholder="Search..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ minHeight: 0 }}
        />
        <IconButton icon="cart-outline" size={28} onPress={() => navigation.navigate('Cart')} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>New Arrivals</Text>
          <Text style={styles.bannerSubText}>Latest drops from Magic & Pokémon!</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Game</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 15 }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Listings</Text>
          <View style={styles.gridContainer}>
            {loading ? (
              <Text style={{ marginLeft: 15 }}>Loading cards...</Text>
            ) : (
              products.map((item) => (
                <View key={item._id} style={{ width: '48%', marginBottom: 15 }}>
                  {renderCardItem({ item })}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 10 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginBottom: 10 },
  searchBar: { flex: 1, elevation: 2, backgroundColor: 'white', borderRadius: 10, height: 45 },
  banner: { margin: 15, padding: 20, backgroundColor: '#6200ee', borderRadius: 12 },
  bannerText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  bannerSubText: { color: 'white', opacity: 0.8, marginTop: 5 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, marginBottom: 15, color: '#333' },
  categoryItem: { alignItems: 'center', marginRight: 20 },
  categoryCircle: { width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryName: { fontSize: 12, fontWeight: '500' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 15 },
  cardItem: { backgroundColor: 'white', elevation: 3 },
  cardImage: { height: 140 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
});