import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MAP_PINS = [
  { id: '1', x: 70, y: 190, title: 'Velvet Office Chair', img: require('../assets/images/items/img_001.jpg'), distance: '0.4 mi' },
  { id: '2', x: 230, y: 130, title: 'IKEA Bookshelf', img: require('../assets/images/items/img_002.jpg'), distance: '1.1 mi' },
  { id: '3', x: 270, y: 280, title: 'Retro Record Player', img: require('../assets/images/items/img_003.jpg'), distance: '0.8 mi' },
  { id: '4', x: 130, y: 340, title: 'Dining Table Set', img: require('../assets/images/items/img_004.jpg'), distance: '2.3 mi' },
  { id: '5', x: 290, y: 180, title: 'Kids Bicycle', img: require('../assets/images/items/img_010.jpg'), distance: '0.5 mi' },
];

export default function MapViewScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const selectedPin = MAP_PINS.find(p => p.id === selected);

  return (
    <View style={styles.container}>
      {/* Top Header Section */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={styles.searchOverlay}>
            <Ionicons name="search" size={16} color="#9CA3AF" />
            <Text style={styles.searchPlaceholder}>Search Paddington, W2...</Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Near you </Text>
          <Text style={styles.headerSub}>5 items waiting to be picked up in your neighborhood</Text>
        </View>
      </View>

      {/* Map Area */}
      <View style={styles.mapArea}>
        {/* Park: Paddington Green */}
        <View style={[styles.park, { top: 90, left: 20, width: 140, height: 90 }]}>
          <Text style={styles.parkLabel}>Paddington Green</Text>
        </View>

        {/* Park: St Mary's Churchyard */}
        <View style={[styles.park, { top: 290, left: 230, width: 120, height: 110 }]}>
          <Text style={styles.parkLabel}>{"St Mary's Gardens"}</Text>
        </View>

        {/* River Canal */}
        <View style={styles.river} />
        <View style={[styles.riverLabelContainer, { top: 235, left: 130, transform: [{ rotate: '-12deg' }] }]}>
          <Text style={styles.riverLabel}>Grand Union Canal</Text>
        </View>

        {/* Intersecting Streets */}
        {/* Harrow Road */}
        <View style={[styles.street, { top: 120, left: 0, right: 0, height: 26 }]} />
        <Text style={[styles.streetLabel, { top: 125, left: 50 }]}>Harrow Rd</Text>

        {/* Praed Street */}
        <View style={[styles.street, { top: 250, left: 0, right: 0, height: 26 }]} />
        <Text style={[styles.streetLabel, { top: 255, left: 180 }]}>Praed St</Text>

        {/* Craven Road */}
        <View style={[styles.street, { top: 370, left: 0, right: 0, height: 26 }]} />
        <Text style={[styles.streetLabel, { top: 375, left: 40 }]}>Craven Rd</Text>

        {/* Bouverie Place (Vertical) */}
        <View style={[styles.street, { left: 160, top: 0, bottom: 0, width: 26 }]} />
        <Text style={[styles.streetLabelVertical, { left: 165, top: 150 }]}>Bouverie Pl</Text>

        {/* Norfolk Place (Vertical) */}
        <View style={[styles.street, { left: 280, top: 0, bottom: 0, width: 26 }]} />
        <Text style={[styles.streetLabelVertical, { left: 285, top: 310 }]}>Norfolk Pl</Text>

        {/* My location */}
        <View style={styles.myLocation}>
          <View style={styles.myLocationDot} />
          <View style={styles.myLocationRing} />
        </View>

        {/* Map pins */}
        {MAP_PINS.map(pin => {
          const isSelected = selected === pin.id;
          return (
            <TouchableOpacity
              key={pin.id}
              style={[styles.pin, { left: pin.x - 20, top: pin.y - 20 }, isSelected && styles.pinActive]}
              onPress={() => setSelected(isSelected ? null : pin.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="gift"
                size={18}
                color={isSelected ? '#fff' : '#FF2424'}
              />
            </TouchableOpacity>
          );
        })}

        {/* Map label */}
        <View style={styles.mapLabel}>
          <Ionicons name="map-outline" size={13} color="#9CA3AF" style={{ marginRight: 4 }} />
          <Text style={styles.mapLabelText}>Interactive map • Paddington W2</Text>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
        {selectedPin ? (
          <TouchableOpacity
            style={styles.selectedCard}
            onPress={() => router.push({ pathname: '/item-detail', params: { id: selectedPin.id, title: selectedPin.title } })}
            activeOpacity={0.9}
          >
            <Image source={selectedPin.img} style={styles.selectedImg} />
            <View style={styles.selectedInfo}>
              <View style={styles.badgeRow}>
                <View style={styles.freeBadge}><Text style={styles.freeBadgeText}>FREE</Text></View>
                <Text style={styles.selectedDistance}>{selectedPin.distance} away</Text>
              </View>
              <Text style={styles.selectedTitle} numberOfLines={1}>{selectedPin.title}</Text>
              <Text style={styles.selectedMeta}>Paddington · Tap for details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.sheetTitle}>{MAP_PINS.length} items near you</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pinPreviews} contentContainerStyle={{ paddingRight: 20 }}>
              {MAP_PINS.map(pin => (
                <TouchableOpacity
                  key={pin.id}
                  style={styles.previewCard}
                  onPress={() => setSelected(pin.id)}
                >
                  <Image source={pin.img} style={styles.previewImg} />
                  <Text style={styles.previewTitle} numberOfLines={1}>{pin.title}</Text>
                  <Text style={styles.previewDistance}>{pin.distance}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 40,
  },
  searchPlaceholder: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleRow: {
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 28,
  },
  headerSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#E8F0E6', // Beautiful pasture green map landscape
    position: 'relative',
    overflow: 'hidden',
  },
  park: {
    position: 'absolute',
    backgroundColor: '#CDE0C4',
    borderRadius: 16,
    padding: 10,
    justifyContent: 'flex-end',
    borderWidth: 1.5,
    borderColor: '#BDD8B2',
  },
  parkLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#557A46',
  },
  river: {
    position: 'absolute',
    top: 220,
    left: -50,
    width: '130%',
    height: 35,
    backgroundColor: '#D0E1F9',
    transform: [{ rotate: '-12deg' }],
  },
  riverLabelContainer: {
    position: 'absolute',
  },
  riverLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B709C',
    letterSpacing: 1.5,
  },
  street: {
    position: 'absolute',
    backgroundColor: '#FFFDF9',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  streetLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '600',
    color: '#8C857B',
  },
  streetLabelVertical: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '600',
    color: '#8C857B',
    transform: [{ rotate: '90deg' }],
  },
  pin: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF2424',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FF2424',
  },
  pinActive: {
    backgroundColor: '#FF2424',
    borderColor: '#FF2424',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    transform: [{ scale: 1.15 }],
  },
  myLocation: {
    position: 'absolute',
    left: 173,
    top: 243,
    width: 20,
    height: 20,
    zIndex: 5,
  },
  myLocationDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#fff',
    top: 4,
    left: 4,
  },
  myLocationRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59,130,246,0.22)',
    top: -6,
    left: -6,
  },
  mapLabel: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLabelText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 15,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },
  pinPreviews: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  previewCard: {
    width: 110,
    marginRight: 14,
  },
  previewImg: {
    width: 110,
    height: 80,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  previewTitle: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '700',
    marginTop: 6,
  },
  previewDistance: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  selectedImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  selectedInfo: {
    flex: 1,
    gap: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  freeBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  freeBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  selectedDistance: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
  },
  selectedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  selectedMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
});

