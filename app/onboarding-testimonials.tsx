import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const reviews = [
  {
    name: 'Daniel R.',
    location: 'Austin, TX',
    stars: 4,
    text: "Pickup finally replaced all those Facebook groups I was scrolling through. Everything from furniture to electronics is in one place, and finding free stuff feels effortless now.",
  },
  {
    name: 'Nadia S.',
    location: 'Seattle, WA',
    stars: 5,
    text: "It's become part of my daily routine. The UI is clean, the listings are real, and pickup is usually super quick and easy.",
  },
  {
    name: 'Marisol G.',
    location: 'Miami, FL',
    stars: 5,
    text: "The notifications are what sold me. I get alerts for items I actually want and I've saved so much money on furniture for my new apartment.",
  },
  {
    name: 'Harlan J.',
    location: 'Austin, TX',
    stars: 5,
    text: "Everything is organized so intuitively. I've tried other apps, but none of them had this many free items or were easy to use.",
  },
  {
    name: 'Jordan M.',
    location: 'San Diego, CA',
    stars: 5,
    text: "I expected something basic, but it keeps getting better. The filters help me find exactly what I need without the hassle.",
  },
  {
    name: 'Vanessa T.',
    location: 'Chicago, IL',
    stars: 4,
    text: "The variety surprised me. From home items to kids toys, there's always something new posted. Great for reducing waste too.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < count ? 'star' : 'star-outline'}
          size={14}
          color="#FFC107"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
}

function ReviewCard({ review, offset }: { review: typeof reviews[0]; offset?: number }) {
  return (
    <View style={[styles.reviewCard, offset ? { marginTop: offset } : null]}>
      <StarRating count={review.stars} />
      <Text style={styles.reviewText}>{review.text}</Text>
      <View>
        <Text style={styles.reviewerName}>{review.name}</Text>
        <Text style={styles.reviewerLocation}>{review.location}</Text>
      </View>
    </View>
  );
}

export default function OnboardingTestimonials() {
  const leftCol = reviews.filter((_, i) => i % 2 === 0);
  const rightCol = reviews.filter((_, i) => i % 2 === 1);

  return (
    <View style={styles.container}>
      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {/* Left Column */}
          <View style={styles.column}>
            {leftCol.map((review, i) => (
              <ReviewCard key={review.name} review={review} offset={i === 0 ? 0 : 0} />
            ))}
          </View>

          {/* Right Column */}
          <View style={[styles.column, styles.columnRight]}>
            {rightCol.map((review, i) => (
              <ReviewCard key={review.name} review={review} offset={40} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA Overlay */}
      <View style={styles.bottomOverlay}>
        {/* Rating Display */}
        <View style={styles.ratingDisplay}>
          <Ionicons name="leaf-outline" size={36} color="#D48C15" />
          <View style={styles.ratingCenter}>
            <View style={styles.ratingStars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons key={i} name="star" size={16} color="#FFC107" style={{ marginHorizontal: 1 }} />
              ))}
            </View>
            <Text style={styles.ratingNumber}>4.8</Text>
            <Text style={styles.ratingLabel}>Over 30K Happy Users</Text>
          </View>
          <Ionicons name="leaf-outline" size={36} color="#D48C15" style={{ transform: [{ scaleX: -1 }] }} />
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Trusted by over{'\n'}30,000+ users
        </Text>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.rateBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/onboarding-notifications')}
        >
          <Text style={styles.rateBtnText}>Rate us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },

  progressWrap: {
    paddingTop: 52,
    paddingHorizontal: 24,
    paddingBottom: 12,
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

  scrollArea: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 12,
    paddingBottom: 420,
  },

  grid: {
    flexDirection: 'row',
    gap: 12,
  },

  column: {
    flex: 1,
    gap: 12,
  },

  columnRight: {
    marginTop: 40,
  },

  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },

  starRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  reviewText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 12,
  },

  reviewerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },

  reviewerLocation: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },

  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingTop: 120,
    paddingBottom: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  ratingCenter: {
    alignItems: 'center',
    marginHorizontal: 12,
  },

  ratingStars: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  ratingNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 36,
  },

  ratingLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },

  headline: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 24,
  },

  rateBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#DF3236',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },

  rateBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
