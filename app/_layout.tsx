import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../context/AppContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import PaywallModal from '../components/paywall';

export default function RootLayout() {
  return (
    <AppProvider>
      <SubscriptionProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="item-detail" />
          <Stack.Screen name="post-item" />
          <Stack.Screen name="map-view" />
        </Stack>
        <PaywallModal />
        <StatusBar style="dark" />
      </SubscriptionProvider>
    </AppProvider>
  );
}
