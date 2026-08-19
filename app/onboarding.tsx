import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const choices = [
  {
    id: 'give',
    title: 'To give away free stuff',
    description: 'I have clutter that deserves a happy new home',
    icon: 'gift-outline',
  },
  {
    id: 'get',
    title: 'To pick up free stuff',
    description: "I'm looking for useful and unique items nearby",
    icon: 'bag-handle-outline',
  },
];

export default function OnboardingScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '25%' }]} />
        </View>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>What brings you to Pickup?</Text>

        <Text style={styles.subtitle}>
          We'll personalise your experience
        </Text>

        {/* Choices */}
        <View style={styles.choiceList}>
          {choices.map((choice) => {
            const isSelected = selected === choice.id;
            const isGive = choice.id === 'give';

            return (
              <TouchableOpacity
                key={choice.id}
                activeOpacity={0.85}
                onPress={() => setSelected(choice.id)}
                style={[
                  styles.choiceCard,
                  isGive
                    ? styles.giveCard
                    : styles.getCard,
                  isSelected && styles.choiceCardSelected,
                ]}
              >
                {/* Icon */}
                <View
                  style={[
                    styles.iconCircle,
                    isGive
                      ? styles.giveIcon
                      : styles.getIcon,
                  ]}
                >
                  <Ionicons
                    name={choice.icon as any}
                    size={24}
                    color={isGive ? '#fff' : '#111827'}
                  />
                </View>

                {/* Text */}
                <View style={styles.choiceText}>
                  <Text style={styles.choiceTitle}>
                    {choice.title}
                  </Text>

                  <Text style={styles.choiceDesc}>
                    {choice.description}
                  </Text>
                </View>

                {/* Radio */}
                <View
                  style={[
                    styles.radio,
                    isSelected && styles.radioSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Location */}
        <View style={styles.locationCard}>
          <View style={styles.locationIcon}>
            <Ionicons
              name="location-outline"
              size={22}
              color="#111827"
            />
          </View>

          <View style={styles.locationText}>
            <Text style={styles.locationTitle}>
              Enable location
            </Text>

            <Text style={styles.locationDesc}>
              To show you items near you
            </Text>
          </View>

          <TouchableOpacity style={styles.enableBtn}>
            <Text style={styles.enableBtnText}>
              Enable
            </Text>
          </TouchableOpacity>
        </View>

        {/* Get Started */}
        <TouchableOpacity
          style={[
            styles.btnPrimary,
            !selected && styles.btnDisabled,
          ]}
          onPress={() => {
            if (selected) {
              router.push('/onboarding-neighborhood');
            }
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>
            Get Started
          </Text>
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity
          onPress={() => router.push('/onboarding-neighborhood')}
        >
          <Text style={styles.skipText}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },

  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#1C1C1E',
  },

  logo: {
    width: 110,
    height: 40,
  },

  content: {
    flex: 1,
    padding: 24,
    gap: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 4,
  },

  choiceList: {
    gap: 12,
  },

  /* GIVE AWAY */
  giveCard: {
    backgroundColor: '#FFF5F5',
  },

  /* PICK UP */
  getCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  choiceCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },

  choiceCardSelected: {
    borderWidth: 1.5,
    borderColor: '#FF2424',
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  giveIcon: {
    backgroundColor: '#FF2424',
  },

  getIcon: {
    backgroundColor: '#F9FAFB',
  },

  choiceText: {
    flex: 1,
    paddingTop: 1,
  },

  choiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  choiceDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  radioSelected: {
    borderColor: '#FF2424',
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF2424',
  },

  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    gap: 12,
  },

  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationText: {
    flex: 1,
  },

  locationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },

  locationDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  enableBtn: {
    backgroundColor: '#111827',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  enableBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  btnPrimary: {
    height: 52,
    backgroundColor: '#FF2424',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 6,
  },

  btnDisabled: {
    opacity: 0.4,
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },

  skipText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
});