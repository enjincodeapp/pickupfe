import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function OnboardingNotifications() {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Top Content */}
      <View style={styles.topContent}>
        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../assets/images/notifications.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <Text style={styles.heading}>
          Should we notify you when someone drops stuff nearby?
        </Text>

        <TouchableOpacity
          style={[styles.continueBtn, isLoading && styles.continueBtnDisabled]}
          activeOpacity={0.85}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.continueBtnText}>Setting up preferences</Text>
            </View>
          ) : (
            <Text style={styles.continueBtnText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  topContent: {
    flex: 1,
  },

  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },

  progressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#1C1C1E',
  },

  illustrationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 56,
    marginBottom: 8,
  },

  illustration: {
    width: width * 1.6,
    height: 720,
  },

  bottomContent: {
    gap: 24,
    marginTop: 32,
  },

  heading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: '#E4302F',
    textAlign: 'center',
    letterSpacing: -0.3,
  },

  continueBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#E4302F',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  continueBtnDisabled: {
    opacity: 0.85,
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  continueBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
});
