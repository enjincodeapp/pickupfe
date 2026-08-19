import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const DEFAULT_LAT = 51.516;
const DEFAULT_LNG = -0.177;

export default function MapViewScreen() {
  const { updateLocation } = useApp();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [markerCoords, setMarkerCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [confirming, setConfirming] = useState(false);
  const [currentLoc, setCurrentLoc] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const granted = status === 'granted';
        setHasPermission(granted);

        if (granted) {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
          setCurrentLoc(coords);
        }
      } catch {
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (results.length > 0) {
        const r = results[0];
        const parts = [r.name, r.street, r.city, r.region].filter(Boolean);
        setAddress(parts.join(', '));
      }
    } catch {
      setAddress('');
    }
  }, []);

  const handleMapPress = useCallback(
    (event: { coordinates: { latitude?: number; longitude?: number } }) => {
      const lat = event.coordinates.latitude;
      const lng = event.coordinates.longitude;
      if (lat == null || lng == null) return;
      const coords = { latitude: lat, longitude: lng };
      setMarkerCoords(coords);
      reverseGeocode(coords.latitude, coords.longitude);
    },
    [reverseGeocode]
  );

  const handleConfirm = useCallback(async () => {
    if (!markerCoords) return;
    setConfirming(true);
    try {
      await updateLocation(markerCoords.latitude, markerCoords.longitude, address || undefined);
      Alert.alert('Location Updated', 'Your location has been saved.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save location. Please try again.');
    } finally {
      setConfirming(false);
    }
  }, [markerCoords, address, updateLocation]);

  const handleUseMyLocation = useCallback(async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setCurrentLoc(coords);
      setMarkerCoords(coords);
      reverseGeocode(coords.latitude, coords.longitude);
      mapRef.current?.setCameraPosition({ coordinates: coords, zoom: 15 });
    } catch {
      Alert.alert('Error', 'Could not get your current location.');
    }
  }, [reverseGeocode]);

  const requestPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === 'granted';
    setHasPermission(granted);
    if (granted) {
      setIsLoading(true);
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        setCurrentLoc(coords);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // --- Loading state ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF2424" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  // --- Permission denied ---
  if (hasPermission === false) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top + 40 }]}>
        <Ionicons name="location-outline" size={64} color="#D1D5DB" />
        <Text style={styles.permTitle}>Location Permission Required</Text>
        <Text style={styles.permDesc}>
          We need access to your location to show you a map and help you select your neighborhood.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Initial map position ---
  const initialPos = currentLoc || { latitude: DEFAULT_LAT, longitude: DEFAULT_LNG };
  const markers = markerCoords
    ? [{ id: 'selected', coordinates: markerCoords, title: 'Selected Location' }]
    : [];

  const MapComponent = Platform.OS === 'ios' ? AppleMaps.View : GoogleMaps.View;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Select Location</Text>
          <Text style={styles.headerSub}>Tap anywhere on the map to place a pin</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Map */}
      <MapComponent
        ref={mapRef}
        style={styles.map}
        cameraPosition={{ coordinates: initialPos, zoom: 14 }}
        markers={markers}
        onMapClick={handleMapPress}
        properties={{
          isMyLocationEnabled: true,
        }}
      />

      {/* Crosshair */}
      {!markerCoords && (
        <View style={styles.crosshair} pointerEvents="none">
          <Ionicons name="location" size={36} color="#FF2424" />
        </View>
      )}

      {/* Use My Location FAB */}
      <TouchableOpacity style={[styles.fab, { bottom: markerCoords ? 220 : 30 }]} onPress={handleUseMyLocation}>
        <Ionicons name="locate" size={22} color="#3B82F6" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      {markerCoords && (
        <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.addressCard}>
            <View style={styles.addressIconWrap}>
              <Ionicons name="location" size={20} color="#FF2424" />
            </View>
            <View style={styles.addressTextWrap}>
              <Text style={styles.addressLabel}>Selected Location</Text>
              <Text style={styles.addressText} numberOfLines={2}>
                {address || `${markerCoords.latitude.toFixed(5)}, ${markerCoords.longitude.toFixed(5)}`}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.confirmBtn, confirming && { opacity: 0.6 }]}
            onPress={handleConfirm}
            disabled={confirming}
            activeOpacity={0.85}
          >
            {confirming ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.confirmBtnText}>Confirm Location</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.changeLink} onPress={() => { setMarkerCoords(null); setAddress(''); }}>
            <Text style={styles.changeLinkText}>Tap map to change</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  loadingText: { marginTop: 14, fontSize: 15, color: '#6B7280', fontWeight: '500' },
  permTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 20, textAlign: 'center' },
  permDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 10, lineHeight: 20 },
  permBtn: { backgroundColor: '#FF2424', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14, marginTop: 24 },
  permBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  backLink: { marginTop: 16 },
  backLinkText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  headerSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  map: { flex: 1 },
  crosshair: { position: 'absolute', top: '50%', left: '50%', marginTop: -18, marginLeft: -18, zIndex: 10 },
  fab: {
    position: 'absolute', right: 18, zIndex: 20,
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 5,
  },
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 15,
  },
  addressCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F9FAFB', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 14,
  },
  addressIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center',
  },
  addressTextWrap: { flex: 1 },
  addressLabel: { fontSize: 11, fontWeight: '600', color: '#9CA3AF', marginBottom: 2 },
  addressText: { fontSize: 14, fontWeight: '600', color: '#111827', lineHeight: 19 },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#FF2424', borderRadius: 14, paddingVertical: 16, marginBottom: 10,
  },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  changeLink: { alignItems: 'center', paddingVertical: 6 },
  changeLinkText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
});
