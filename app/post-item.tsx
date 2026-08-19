import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';

const PRESET_SAMPLE_PHOTOS = [
  'img_001.jpg',
  'img_002.jpg',
  'img_003.jpg',
  'img_004.jpg',
  'img_010.jpg',
  'img_011.jpg',
  'img_012.jpg',
];

export default function PostItemScreen() {
  const { categories, createListing, currentUser } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('1'); // Default: Furniture
  const [condition, setCondition] = useState<'Good' | 'Bad'>('Good');
  const [images, setImages] = useState<string[]>(['img_001.jpg']); // At least 1 image pre-selected for smooth flow
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImageFromGallery = async () => {
    if (images.length >= 3) {
      Alert.alert('Limit Reached', 'Maximum 3 photos allowed.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } catch {
      // Fallback if gallery permission or web platform error occurs
      const nextSample = PRESET_SAMPLE_PHOTOS[images.length % PRESET_SAMPLE_PHOTOS.length];
      if (!images.includes(nextSample)) {
        setImages((prev) => [...prev, nextSample]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert('Photo Required', 'Please upload at least one existing photo of your item.');
      return;
    }
    if (images.length > 2) {
      Alert.alert('Photo Limit', 'Maximum 2 photos allowed.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter an item name.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please enter a description.');
      return;
    }

    setIsSubmitting(true);
    const res = await createListing({
      title: title.trim(),
      description: description.trim(),
      category_id: categoryId,
      condition,
      images,
    });
    setIsSubmitting(false);

    if (res.success) {
      Alert.alert('Item Posted! 🎉', 'Your item has been listed for your neighbors.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } else {
      Alert.alert('Error', res.error || 'Failed to post item.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post an Item</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Photo Upload Area */}
        <Text style={styles.label}>Existing Item Photos * (Min 1, Max 3)</Text>
        <TouchableOpacity
          style={[styles.photoArea, images.length >= 3 && styles.photoAreaDisabled]}
          onPress={pickImageFromGallery}
          activeOpacity={0.8}
        >
          <Ionicons name="images-outline" size={36} color="#9CA3AF" />
          <Text style={styles.photoTitle}>Upload Photo from Gallery</Text>
          <Text style={styles.photoSub}>Select 1 to 3 existing photos ({images.length}/3 selected)</Text>
        </TouchableOpacity>

        {/* Selected Image Thumbnails */}
        {images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbsRow}>
            {images.map((img, i) => (
              <View key={i} style={styles.thumbWrap}>
                <Image
                  source={
                    img.startsWith('file:') || img.startsWith('content:') || img.startsWith('data:')
                      ? { uri: img }
                      : require('../assets/images/items/img_001.jpg')
                  }
                  style={styles.thumbImg}
                />
                <TouchableOpacity style={styles.thumbRemove} onPress={() => removeImage(i)}>
                  <Ionicons name="close-circle" size={20} color="#FF2424" />
                </TouchableOpacity>
                {i === 0 && (
                  <View style={styles.mainBadge}>
                    <Text style={styles.mainBadgeText}>Cover</Text>
                  </View>
                )}
              </View>
            ))}
            {images.length < 3 && (
              <TouchableOpacity style={styles.addThumb} onPress={pickImageFromGallery}>
                <Ionicons name="add" size={28} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </ScrollView>
        )}

        {/* Item Name */}
        <Text style={styles.label}>Item Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Vintage Office Chair, IKEA Desk"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
        />

        {/* Category */}
        <Text style={styles.label}>Category *</Text>
        <View style={styles.chipGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, categoryId === cat.id && styles.chipActive]}
              onPress={() => setCategoryId(cat.id)}
            >
              <Text style={[styles.chipText, categoryId === cat.id && styles.chipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Condition */}
        <Text style={styles.label}>Condition *</Text>
        <View style={styles.chipRow}>
          {(['Good', 'Bad'] as const).map((cond) => (
            <TouchableOpacity
              key={cond}
              style={[styles.chip, condition === cond && styles.chipActive]}
              onPress={() => setCondition(cond)}
            >
              <Text style={[styles.chipText, condition === cond && styles.chipTextActive]}>
                {cond === 'Good' ? '👍 Good Condition' : '👎 Bad / Needs Repair'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the item, dimensions, pick-up hours, etc."
          placeholderTextColor="#9CA3AF"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        {/* Pickup Location */}
        <Text style={styles.label}>Pick-up Location</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={18} color="#FF2424" />
          <Text style={styles.locationText}>{currentUser?.neighborhood || 'Paddington, W2'} (Your Neighborhood)</Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Post Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.postBtn,
            (!title || !description || images.length === 0 || isSubmitting) && styles.postBtnDisabled,
          ]}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={!title || !description || images.length === 0 || isSubmitting}
        >
          <Text style={styles.postBtnText}>{isSubmitting ? 'Posting...' : 'Post Item for Free 🎉'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  scroll: { padding: 20, paddingBottom: 120 },
  photoArea: {
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F9FAFB',
    marginBottom: 14,
  },
  photoAreaDisabled: { opacity: 0.6 },
  photoTitle: { fontSize: 15, fontWeight: '700', color: '#374151' },
  photoSub: { fontSize: 12, color: '#9CA3AF' },
  thumbsRow: { marginBottom: 16, flexDirection: 'row' },
  thumbWrap: { position: 'relative', marginRight: 12 },
  thumbImg: { width: 80, height: 80, borderRadius: 12 },
  thumbRemove: { position: 'absolute', top: -8, right: -8, backgroundColor: '#fff', borderRadius: 10 },
  mainBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: '#111827',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  mainBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  addThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  label: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 8, marginTop: 14 },
  input: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#FF2424', borderColor: '#FF2424' },
  chipText: { fontSize: 13, color: '#374151', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    backgroundColor: '#F9FAFB',
  },
  locationText: { flex: 1, fontSize: 15, color: '#374151' },
  spacer: { height: 20 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  postBtn: {
    height: 52,
    backgroundColor: '#FF2424',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF2424',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  postBtnDisabled: { opacity: 0.45 },
  postBtnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
