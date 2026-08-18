import React, { useState, useEffect } from 'react';
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
import { db, Message } from '../../services/database';

export default function MessagesTabScreen() {
  const { conversations, listings, getImagesForListing, currentUser } = useApp();
  const [latestMessages, setLatestMessages] = useState<Record<string, Message>>({});

  useEffect(() => {
    async function loadLatest() {
      const msgsMap: Record<string, Message> = {};
      for (const conv of conversations) {
        const msgs = await db.getMessages(conv.id);
        if (msgs.length > 0) {
          msgsMap[conv.id] = msgs[msgs.length - 1];
        }
      }
      setLatestMessages(msgsMap);
    }
    loadLatest();
  }, [conversations]);

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
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSub}>{conversations.length} active chats</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySub}>
            Message neighbors about free items to arrange pickup and chat!
          </Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.browseBtnText}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {conversations.map((conv) => {
            const listing = listings.find((l) => l.id === conv.listing_id);
            const lastMsg = latestMessages[conv.id];
            const isUserOwner = currentUser?.id === conv.poster_id;
            const otherName = isUserOwner ? 'Buyer' : 'Sarah Jenkins';

            return (
              <TouchableOpacity
                key={conv.id}
                style={styles.chatCard}
                onPress={() =>
                  router.push({
                    pathname: '/chat',
                    params: { conversationId: conv.id, listingId: conv.listing_id },
                  })
                }
                activeOpacity={0.85}
              >
                <View style={styles.thumbWrap}>
                  <Image
                    source={getItemImage(conv.listing_id)}
                    style={styles.itemThumb}
                  />
                  <View style={styles.avatarMini}>
                    <Text style={styles.avatarMiniText}>
                      {otherName.substring(0, 1).toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.chatInfo}>
                  <View style={styles.chatTitleRow}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {listing?.title || 'Free Item'}
                    </Text>
                    <Text style={styles.timeText}>Recently</Text>
                  </View>
                  <Text style={styles.personName}>{otherName}</Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {lastMsg ? lastMsg.message : 'Tap to open chat...'}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  headerSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  scroll: { padding: 16, gap: 12, paddingBottom: 40 },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbWrap: { position: 'relative' },
  itemThumb: { width: 60, height: 60, borderRadius: 14, resizeMode: 'cover' },
  avatarMini: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF2424',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  avatarMiniText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  chatInfo: { flex: 1, gap: 2 },
  chatTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '800', color: '#111827', flex: 1 },
  timeText: { fontSize: 11, color: '#9CA3AF' },
  personName: { fontSize: 12, fontWeight: '700', color: '#FF2424' },
  lastMessage: { fontSize: 13, color: '#4B5563', marginTop: 1 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 40 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
  emptySub: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  browseBtn: { marginTop: 12, height: 48, backgroundColor: '#FF2424', borderRadius: 14, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
