import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Searchbar, Card, Text, Surface, Button, ActivityIndicator } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';

// 1. Import your API config
import { API_URL } from '../config';

export default function ShopScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Camera state
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`);
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.log("Fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter products locally based on the search bar
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Triggered when the camera reads a physical barcode
  const handleBarcodeScanned = ({ type, data }) => {
    setIsScanning(false);
    Alert.alert(
      "Barcode Detected!", 
      `Format: ${type}\nCode: ${data}\n\nSearching database...`
    );
    // Automatically plug the scanned code into the search bar
    setSearchQuery(data);
  };

  const openScanner = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Permission needed", "We need camera permission to scan barcodes.");
        return;
      }
    }
    setIsScanning(true);
  };

  // If scanning mode is active, take over the screen with the camera
  if (isScanning) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing="back"
          barcodeScannerSettings={{
            // Specifically targeting the standard retail product formats
            barcodeTypes: ["ean13", "upc_a", "qr"],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        />
        <Button 
          mode="contained" 
          onPress={() => setIsScanning(false)} 
          style={styles.cancelButton} 
          buttonColor="#EF5350"
          contentStyle={{ height: 50 }}
        >
          Cancel Scan
        </Button>
      </View>
    );
  }

  // Standard Shop View
  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={3}>
        <Searchbar
          placeholder="Search items or EAN-13/UPC-A..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Button 
          mode="contained-tonal" 
          icon="barcode-scan" 
          onPress={openScanner}
          style={styles.scanButton}
        >
          Scan Physical Item
        </Button>
      </Surface>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} animating={true} color="#6200ee" size="large" />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <Card 
              style={styles.card} 
              onPress={() => navigation.navigate('ProductDetails', { product: item })}
            >
              <Card.Title 
                title={item.name} 
                subtitle={`$${item.price?.toFixed(2)} - ${item.game}`} 
                titleStyle={{ fontWeight: 'bold' }}
              />
            </Card>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No listings match your search.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20, backgroundColor: 'white', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, paddingTop: 40 },
  searchBar: { marginBottom: 15, backgroundColor: '#f0f0f0', borderRadius: 12 },
  scanButton: { borderRadius: 10 },
  listContainer: { padding: 15, paddingBottom: 100 },
  card: { marginBottom: 15, backgroundColor: 'white', borderRadius: 12, elevation: 2 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888', fontSize: 16 },
  cameraContainer: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  cancelButton: { position: 'absolute', bottom: 40, alignSelf: 'center', borderRadius: 25, width: '60%' }
});