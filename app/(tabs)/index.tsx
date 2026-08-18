import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useApp } from '../../context/AppContext';
import { useSubscription } from '../../context/SubscriptionContext';

export default function HomeScreen() {
  const { listings, categories, isFavorite, toggleFavorite, getImagesForListing } = useApp();
  const { isPremium, showPaywall } = useSubscription();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = listings.filter((item) => {
    const matchesCategory =
      activeCategory === 'All' ||
      (categories.find((c) => c.name.toLowerCase() === activeCategory.toLowerCase())?.id === item.category_id);
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
          <TouchableOpacity style={styles.mapBtn} onPress={() => router.push('/map-view')}>
            <Ionicons name="map-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={15} color="#FF2424" />
          <Text style={styles.locationText}>Paddington, W2 · <Text style={styles.locationLink}>Change</Text></Text>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search free items nearby..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {['All', 'Furniture', 'Electronics', 'Home & Garden', 'Others'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Items Grid */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Near You • {filteredListings.length} items</Text>
          <TouchableOpacity style={styles.postCta} onPress={() => router.push('/post-item')}>
            <Ionicons name="add-circle" size={18} color="#FF2424" />
            <Text style={styles.postCtaText}>Post Free Item</Text>
          </TouchableOpacity>
        </View>

        {filteredListings.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>🎁</Text>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySub}>Be the first to list a free item for your community!</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/post-item')}>
              <Text style={styles.emptyBtnText}>Post an Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredListings.map((item) => {
              const fav = isFavorite(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id, title: item.title } })}
                  activeOpacity={0.9}
                >
                  <View style={styles.thumb}>
                    <Image source={getItemImage(item.id)} style={styles.thumbImg} />
                    {!isPremium && (
                      <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={0.85}
                        onPress={showPaywall}
                      >
                        <BlurView intensity={35} tint="light" style={styles.thumbBlur}>
                          <View style={styles.thumbLockPill}>
                            <Ionicons name="lock-closed" size={12} color="#fff" />
                            <Text style={styles.thumbLockText}>Premium</Text>
                          </View>
                        </BlurView>
                      </TouchableOpacity>
                    )}
                    <View style={styles.thumbTop}>
                      <View style={styles.freeBadge}>
                        <Text style={styles.freeBadgeText}>FREE</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.heartBtn}
                        onPress={() => toggleFavorite(item.id)}
                      >
                        <Ionicons
                          name={fav ? 'heart' : 'heart-outline'}
                          size={15}
                          color={fav ? '#FF2424' : '#111827'}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.conditionBadge}>
                      <Text style={styles.conditionBadgeText}>Condition: {item.condition}</Text>
                    </View>
                  </View>
                  <View style={styles.details}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.itemMeta}>0.4 mi · Paddington</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#fff', paddingTop: 54, paddingHorizontal: 18, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  logo: { width: 100, height: 36 },
  mapBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  locationText: { fontSize: 13, color: '#4B5563' },
  locationLink: { color: '#FF2424', fontWeight: '600' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 12, marginBottom: 12, height: 44, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  categories: { marginBottom: 8 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F3F4F6', marginRight: 8 },
  catChipActive: { backgroundColor: '#FF2424' },
  catText: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  catTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 80 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  postCta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postCtaText: { color: '#FF2424', fontSize: 13, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47.5%', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  thumb: { position: 'relative', aspectRatio: 4 / 3, overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  thumbBlur: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  thumbLockPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(17,24,39,0.55)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  thumbLockText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  thumbTop: { position: 'absolute', top: 8, left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  freeBadge: { backgroundColor: '#ECFDF5', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  freeBadgeText: { color: '#10B981', fontSize: 10, fontWeight: '700' },
  heartBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  conditionBadge: { position: 'absolute', bottom: 6, left: 6, backgroundColor: 'rgba(17,24,39,0.85)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  conditionBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  details: { padding: 10 },
  itemTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 3 },
  itemMeta: { fontSize: 11, color: '#6B7280' },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 10 },
  emptyEmoji: { fontSize: 44 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  emptySub: { fontSize: 13, color: '#6B7280', textAlign: 'center', paddingHorizontal: 20 },
  emptyBtn: { backgroundColor: '#FF2424', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 10 },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
