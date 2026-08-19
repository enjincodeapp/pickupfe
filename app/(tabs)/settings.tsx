import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { useSubscription } from '../../context/SubscriptionContext';

export default function SettingsScreen() {
  const { currentUser, signOut } = useApp();
  const { isPremium, showPaywall } = useSubscription();
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/sign-in');
        },
      },
    ]);
  };

  const handleUpgrade = () => {
    showPaywall();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'Type nothing, just confirm: your account will be deleted immediately.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete My Account',
                  style: 'destructive',
                  onPress: async () => {
                    await signOut();
                    router.replace('/sign-in');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile Card from Users Table */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'JD'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser?.name || 'Jane Doe'}</Text>
            <Text style={styles.profileEmail}>{currentUser?.email || 'jane@example.com'}</Text>
            <Text style={styles.profileLocation}>📍 {currentUser?.neighborhood || 'Paddington, W2'}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={() => Alert.alert('Profile', 'Profile edit features.')}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Subscription Info */}
        <View style={styles.subCard}>
          <View style={styles.subHeader}>
            {/* <Ionicons name="sparkles" size={20} color="#f5b30b" /> */}
            {/* <Text style={styles.subTitle}>Subscription Plan</Text> */}
          </View>
          <Text style={styles.subPlan}>{isPremium ? 'Premium Plan' : 'Free Plan'}</Text>
          <Text style={styles.subStatus}>
            {isPremium ? 'Active' : 'Active'}
          </Text>
        </View>

        {/* Notifications Toggle */}
        <View style={styles.section}>
          <View style={styles.sectionItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={22} color="#374151" />
              <View>
                <Text style={styles.menuLabel}>Notifications</Text>
                <Text style={styles.menuSub}>Push alerts for new items nearby</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E7EB', true: '#FF2424' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Settings Menu Items */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="location-outline" size={22} color="#374151" />
              <View>
                <Text style={styles.menuLabel}>Location Radius</Text>
                <Text style={styles.menuSub}>2 miles radius from {currentUser?.neighborhood || 'Paddington, W2'}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.sectionItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#374151" />
              <View>
                <Text style={styles.menuLabel}>Privacy & Security</Text>
                <Text style={styles.menuSub}>Manage account security</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.sectionItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={22} color="#374151" />
              <View>
                <Text style={styles.menuLabel}>Support & FAQs</Text>
                <Text style={styles.menuSub}>Get help or give feedback</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {!isPremium && (
            <TouchableOpacity style={styles.sectionItem} onPress={handleUpgrade}>
              <View style={styles.menuLeft}>
                <Ionicons name="sparkles-outline" size={22} color="#374151" />
                <View>
                  <Text style={styles.menuLabel}>Upgrade</Text>
                  <Text style={styles.menuSub}>Unlock full-visibility listing photos</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionItem} onPress={handleDeleteAccount}>
            <View style={styles.menuLeft}>
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
              <View>
                <Text style={[styles.menuLabel, styles.dangerText]}>Delete Account</Text>
                <Text style={styles.menuSub}>Permanently delete your account and data</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Pickup v1.0.0 · Community Platform</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  scroll: { padding: 16, gap: 14, paddingBottom: 40 },
  profileCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FF2424', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '700', color: '#111827' },
  profileEmail: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  profileLocation: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  editBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB' },
  editBtnText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  subCard: { backgroundColor: '#FFFBEB', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#FDE68A' },
  subHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  subTitle: { fontSize: 14, fontWeight: '700', color: '#92400E' },
  subPlan: { fontSize: 16, fontWeight: '800', color: '#78350F' },
  subStatus: { fontSize: 12, color: '#B45309', marginTop: 2 },
  section: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  sectionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  menuLabel: { fontSize: 15, color: '#222', fontWeight: '600' },
  dangerText: { color: '#EF4444' },
  menuSub: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 16 },
  signOutBtn: { height: 50, backgroundColor: '#FFF5F5', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  signOutText: { fontSize: 16, fontWeight: '700', color: '#EF4444' },
  version: { textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 4 },
});
