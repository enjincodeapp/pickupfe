import { Platform } from 'react-native';

export const REVENUECAT_API_KEY =
  Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS!
    : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID!;

export const PREMIUM_ENTITLEMENT_ID = 'premium';
