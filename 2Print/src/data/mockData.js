export const CATEGORIES = [
  { id: '1', name: 'Magic', icon: 'cards-playing-outline', color: '#F2994A' }, // Orange
  { id: '2', name: 'Pokémon', icon: 'pokeball', color: '#EF5350' }, // Red
  { id: '3', name: 'Yu-Gi-Oh!', icon: 'eye-outline', color: '#AB47BC' }, // Purple
  { id: '4', name: 'Lorcana', icon: 'water-outline', color: '#29B6F6' }, // Blue
  { id: '5', name: 'One Piece', icon: 'skull-outline', color: '#FFEE58' }, // Yellow
];


{/* Featured Products Grid */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Featured Listings</Text>
  <View style={styles.gridContainer}>
    {loading ? (
      <Text>Loading cards...</Text>
    ) : (
      products.map((item) => (
        <View key={item._id} style={{ width: '48%', marginBottom: 15 }}>
          {renderCardItem({ item })}
        </View>
      ))
    )}
  </View>
</View>
