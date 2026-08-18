import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useApp } from '../context/AppContext';
import { useSubscription } from '../context/SubscriptionContext';
import { db } from '../services/database';

export default function ItemDetailScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const { listings, categories, isFavorite, toggleFavorite, getImagesForListing } = useApp();
  const { isPremium, showPaywall } = useSubscription();
  const [claiming, setClaiming] = useState(false);

  const listing = listings.find((l) => l.id === id) || {
    id: id || 'l1',
    user_id: 'u2',
    title: title || 'Velvet Office Chair',
    description: 'In great condition, barely used. Moving house and cannot take it with me. Collection only.',
    category_id: '1',
    condition: 'Good' as const,
    latitude: 51.516,
    longitude: -0.177,
    status: 'available' as const,
    created_at: new Date().toISOString(),
  };

  const categoryName = categories.find((c) => c.id === listing.category_id)?.name || 'Furniture';
  const fav = isFavorite(listing.id);
  const itemImages = getImagesForListing(listing.id);

  const getImageSource = (img: string) => {
    if (img.startsWith('file:') || img.startsWith('content:') || img.startsWith('data:')) {
      return { uri: img };
    }
    if (img === 'img_002.jpg') return require('../assets/images/items/img_002.jpg');
    if (img === 'img_003.jpg') return require('../assets/images/items/img_003.jpg');
    if (img === 'img_004.jpg') return require('../assets/images/items/img_004.jpg');
    if (img === 'img_010.jpg') return require('../assets/images/items/img_010.jpg');
    if (img === 'img_011.jpg') return require('../assets/images/items/img_011.jpg');
    if (img === 'img_012.jpg') return require('../assets/images/items/img_012.jpg');
    return require('../assets/images/items/img_001.jpg');
  };

  const handleClaim = async () => {
    setClaiming(true);
    const claim = await db.createClaim(listing.id);
    setClaiming(false);
    if (claim) {
      Alert.alert(
        'Request Sent! 🎁',
        `Your pickup request for "${listing.title}" has been submitted. The owner will be notified to arrange pickup time.`,
        [{ text: 'Great!', onPress: () => router.replace('/(tabs)') }]
      );
    } else {
      Alert.alert('Notice', 'Failed to request item. Please check your connection.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image / Carousel */}
        <View style={styles.heroWrap}>
          <Image source={getImageSource(itemImages[0] || 'img_001.jpg')} style={styles.heroImg} />
          {!isPremium && (
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={0.85} onPress={showPaywall}>
              <BlurView intensity={40} tint="light" style={styles.heroBlur}>
                <View style={styles.heroLockPill}>
                  <Ionicons name="lock-closed" size={14} color="#fff" />
                  <Text style={styles.heroLockText}>Unlock with Premium</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(listing.id)}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? '#FF2424' : '#111827'} />
          </TouchableOpacity>
          <View style={styles.freePill}>
            <Text style={styles.freePillText}>FREE</Text>
          </View>
        </View>

        {/* Thumbnail Gallery if multiple images */}
        {itemImages.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.multiImgsRow}>
            {itemImages.map((imgUrl, i) => (
              <View key={i} style={styles.subImgWrap}>
                <Image source={getImageSource(imgUrl)} style={styles.subImgThumb} />
                {!isPremium && (
                  <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={0.85} onPress={showPaywall}>
                    <BlurView intensity={30} tint="light" style={styles.subImgBlur} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.content}>
          <Text style={styles.itemTitle}>{listing.title}</Text>

          <View style={styles.metaRow}>
            <Ionicons name="location" size={14} color="#FF2424" />
            <Text style={styles.metaText}>0.4 mi · Paddington, W2</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.metaText}>Status: {listing.status}</Text>
          </View>

          {/* Condition & Category Badges */}
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>📁 {categoryName}</Text>
            </View>
            <View style={[styles.conditionBadge, listing.condition === 'Good' ? styles.goodBg : styles.badBg]}>
              <Text style={styles.conditionText}>Condition: {listing.condition}</Text>
            </View>
          </View>

          {/* Giver Info */}
          <View style={styles.giverCard}>
            <View style={styles.giverAvatar}><Text style={styles.giverAvatarText}>SM</Text></View>
            <View style={styles.giverInfo}>
              <Text style={styles.giverName}>Sarah M.</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.rating}>4.9 · 23 items given</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.messageBtn} onPress={() => Alert.alert('Chat', 'Starting conversation with owner...')}>
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.sectionHead}>Description</Text>
          <Text style={styles.description}>{listing.description}</Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            <View style={styles.tag}><Text style={styles.tagText}>{listing.condition} condition</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>Smoke-free</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>Pet-free</Text></View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btnRequest} activeOpacity={0.85} onPress={handleClaim} disabled={claiming}>
          <Ionicons name="hand-right-outline" size={18} color="#fff" />
          <Text style={styles.btnRequestText}>{claiming ? 'Requesting...' : 'Request This Item'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroWrap: { position: 'relative', height: 280, overflow: 'hidden' },
  heroImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroBlur: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroLockPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(17,24,39,0.6)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  heroLockText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  backBtn: { position: 'absolute', top: 52, left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  favBtn: { position: 'absolute', top: 52, right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  freePill: { position: 'absolute', bottom: 14, left: 16, backgroundColor: '#ECFDF5', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  freePillText: { color: '#10B981', fontWeight: '700', fontSize: 12 },
  multiImgsRow: { paddingHorizontal: 16, paddingTop: 10, flexDirection: 'row' },
  subImgWrap: { width: 60, height: 60, borderRadius: 8, marginRight: 8, overflow: 'hidden', position: 'relative' },
  subImgThumb: { width: 60, height: 60, resizeMode: 'cover' },
  subImgBlur: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  itemTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  metaText: { fontSize: 13, color: '#6B7280' },
  dot: { color: '#D1D5DB' },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  categoryBadge: { backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  categoryBadgeText: { fontSize: 12, fontWeight: '700', color: '#374151' },
  conditionBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  goodBg: { backgroundColor: '#ECFDF5' },
  badBg: { backgroundColor: '#FEF2F2' },
  conditionText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  giverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 14, padding: 14, marginBottom: 20, gap: 12 },
  giverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF2424', alignItems: 'center', justifyContent: 'center' },
  giverAvatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  giverInfo: { flex: 1 },
  giverName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rating: { fontSize: 12, color: '#6B7280' },
  messageBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#111827' },
  messageBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  sectionHead: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 8 },
  description: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 16 },
  tagsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6' },
  tagText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6', padding: 16, paddingBottom: 34 },
  btnRequest: { height: 52, backgroundColor: '#FF2424', borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#FF2424', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  btnRequestText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
