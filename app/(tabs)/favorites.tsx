import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

export default function FavoritesScreen() {
  const { listings, favorites, toggleFavorite, getImagesForListing, currentUser } = useApp();

  const userNeighborhood = currentUser?.neighborhood || 'Paddington, W2';

  const favListings = listings.filter((l) =>
    favorites.some((f) => f.listing_id === l.id)
  );

  const getItemImage = (listingId: string) => {
    const imgs = getImagesForListing(listingId);
    if (imgs.length > 0) {
      const img = imgs[0];
      if (img.startsWith('file:') || img.startsWith('content:') || img.startsWith('data:')) {
        return { uri: img };
      }
      if (img === 'img_002.jpg') return require('../../assets/images/items/img_002.jpg');
      if (img === 'img_003.jpg') return require('../../assets/images/items/img_003.jpg');
      if (img === 'img_004.jpg') return require('../../assets/images/items/img_004.jpg');
      if (img === 'img_010.jpg') return require('../../assets/images/items/img_010.jpg');
      if (img === 'img_011.jpg') return require('../../assets/images/items/img_011.jpg');
      if (img === 'img_012.jpg') return require('../../assets/images/items/img_012.jpg');
    }
    return require('../../assets/images/items/img_001.jpg');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSub}>{favListings.length} saved items</Text>
      </View>

      {favListings.length === 0 ? (
        <View style={styles.emptyState}>
          {/* <Text style={styles.emptyEmoji}>💛</Text> */}
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySub}>Tap the heart on any item to save it here</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.browseBtnText}>Browse items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.grid}>
            {favListings.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id, title: item.title } })}
                activeOpacity={0.9}
              >
                <View style={styles.thumb}>
                  <Image source={getItemImage(item.id)} style={styles.thumbImg} />
                  <View style={styles.thumbTop}>
                    <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>FREE</Text></View>
                    <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavorite(item.id)}>
                      <Ionicons name="heart" size={15} color="#FF2424" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.conditionBadge}>
                    <Text style={styles.conditionBadgeText}>Condition: {item.condition}</Text>
                  </View>
                </View>
                <View style={styles.details}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.itemMeta}>0.4 mi · {userNeighborhood.split(',')[0]}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  headerSub: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  scroll: { padding: 14, paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47.5%', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  thumb: { position: 'relative', aspectRatio: 4 / 3 },
  thumbImg: { width: '100%', height: '100%' },
  thumbTop: { position: 'absolute', top: 8, left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  freeBadge: { backgroundColor: '#ECFDF5', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  freeBadgeText: { color: '#10B981', fontSize: 10, fontWeight: '700' },
  heartBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  conditionBadge: { position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(17,24,39,0.85)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  conditionBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  details: { padding: 10 },
  itemTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 3 },
  itemMeta: { fontSize: 11, color: '#6B7280' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 40 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
  emptySub: { fontSize: 15, color: '#6B7280', textAlign: 'center' },
  browseBtn: { marginTop: 12, height: 48, backgroundColor: '#FF2424', borderRadius: 14, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
