import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function OnboardingNeighborhood() {
  return (
    <ImageBackground
      source={require('../assets/images/neighborhood.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.topSection}>
        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFillHalf} />
        </View>

        {/* Heading */}
        <Text style={styles.heading}>
          Neighbors near you dropped free stuff
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/onboarding-testimonials')}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },

  topSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 60,
  },

  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E5E5',
    marginBottom: 32,
    overflow: 'hidden',
  },

  progressFillHalf: {
    width: '50%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#111827',
  },

  heading: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '700',
    color: '#000',
    letterSpacing: -0.5,
  },

  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  continueBtn: {
    width: '100%',
    height: 60,
    backgroundColor: '#E32B31',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  continueBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
  },
});
