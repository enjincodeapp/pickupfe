import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../context/SubscriptionContext';

const { width } = Dimensions.get('window');

export default function PaywallModal() {
  const { paywallVisible, hidePaywall, currentOffering, isPurchasing, purchasePackage, restorePurchases } =
    useSubscription();

  const annualPackage = currentOffering?.availablePackages.find(
    (p) => p.identifier === '$rc_annual'
  );
  const product = annualPackage?.product;

  const monthlyEquivalent = product
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: product.currencyCode }).format(
        product.price / 12
      )
    : null;

  const handleRedeem = async () => {
    if (isPurchasing || !annualPackage) return;
    const result = await purchasePackage(annualPackage);
    if (!result.success && result.error) {
      Alert.alert('Purchase failed', result.error);
    }
  };

  const handleRestore = async () => {
    const result = await restorePurchases();
    if (!result.success) {
      Alert.alert('Restore Purchases', result.error || 'No active subscription found.');
    }
  };

  return (
    <Modal
      visible={paywallVisible}
      transparent
      animationType="slide"
      onRequestClose={hidePaywall}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={hidePaywall}>
            <Ionicons name="close" size={22} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Logo area */}
          <View style={styles.logoWrap}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Limited time offer</Text>

          {/* Pricing */}
          <View style={styles.priceRow}>
            <Text style={styles.originalPrice}>$79.99</Text>
            <Text style={styles.salePrice}>{monthlyEquivalent ? `${monthlyEquivalent}/mo` : '—'}</Text>
          </View>
          <Text style={styles.billedText}>
            {product ? `Billed annually at ${product.priceString}` : 'Loading pricing…'}
          </Text>

          {/* Features */}


          {/* CTA Button */}
          <TouchableOpacity
            style={[styles.redeemBtn, (isPurchasing || !annualPackage) && styles.redeemBtnDisabled]}
            onPress={handleRedeem}
            disabled={isPurchasing || !annualPackage}
            activeOpacity={0.85}
          >
            {isPurchasing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.redeemBtnText}>Redeem Offer</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRestore} disabled={isPurchasing}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.termsText}>
            TERMS OF USE · PRIVACY POLICY
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoWrap: {
    marginTop: 14,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 18,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  salePrice: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
  },
  billedText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 18,
  },
  featuresList: {
    width: '100%',
    gap: 10,
    marginBottom: 22,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  redeemBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#FF2424',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF2424',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 14,
  },
  redeemBtnDisabled: { opacity: 0.6 },
  redeemBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  restoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 14,
  },
  termsText: {
    fontSize: 11,
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
});
