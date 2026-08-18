import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';
import { REVENUECAT_API_KEY, PREMIUM_ENTITLEMENT_ID } from '../constants/revenuecat';
import { api } from '../services/api';

interface SubscriptionContextType {
  isPremium: boolean;
  isReady: boolean;
  currentOffering: PurchasesOffering | null;
  paywallVisible: boolean;
  isPurchasing: boolean;
  showPaywall: () => void;
  hidePaywall: () => void;
  purchasePackage: (pkg: PurchasesPackage) => Promise<{ success: boolean; error?: string }>;
  restorePurchases: () => Promise<{ success: boolean; error?: string }>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

const hasPremiumEntitlement = (info: CustomerInfo) =>
  typeof info.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== 'undefined';

let didConfigure = false;

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (!didConfigure) {
      didConfigure = true;
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }
      Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    }

    const onCustomerInfoUpdate = (info: CustomerInfo) => {
      setIsPremium(hasPremiumEntitlement(info));
    };
    Purchases.addCustomerInfoUpdateListener(onCustomerInfoUpdate);

    const init = async () => {
      try {
        const [{ current }, info] = await Promise.all([
          Purchases.getOfferings(),
          Purchases.getCustomerInfo(),
        ]);
        setCurrentOffering(current);
        setIsPremium(hasPremiumEntitlement(info));
      } catch (e) {
        console.error('Error initializing RevenueCat:', e);
      } finally {
        setIsReady(true);
      }
    };
    init();

    return () => {
      Purchases.removeCustomerInfoUpdateListener(onCustomerInfoUpdate);
    };
  }, []);

  const showPaywall = () => setPaywallVisible(true);
  const hidePaywall = () => setPaywallVisible(false);

  /**
   * The RevenueCat SDK's local entitlement check is enough for a snappy UI,
   * but the backend re-verifies directly against RevenueCat's API before
   * trusting the purchase for anything server-side. If the backend
   * explicitly reports the entitlement isn't active, that verdict wins.
   */
  const verifyWithBackend = async (productId?: string, transactionId?: string) => {
    try {
      const result = await api.verifySubscription({
        product_id: productId,
        transaction_id: transactionId,
      });
      if (result.verified) {
        setIsPremium(result.is_premium);
      }
      return result;
    } catch (e) {
      console.error('Backend subscription verification failed:', e);
      return null;
    }
  };

  const purchasePackage = async (pkg: PurchasesPackage) => {
    if (isPurchasing) return { success: false };
    setIsPurchasing(true);
    try {
      const { customerInfo, transaction } = await Purchases.purchasePackage(pkg);
      const premium = hasPremiumEntitlement(customerInfo);
      setIsPremium(premium);

      if (!premium) {
        return { success: false };
      }

      const verification = await verifyWithBackend(
        transaction?.productIdentifier ?? pkg.product.identifier,
        transaction?.transactionIdentifier
      );
      if (verification && !verification.is_premium) {
        return { success: false, error: 'We could not verify this purchase with RevenueCat. Please contact support.' };
      }

      setPaywallVisible(false);
      return { success: true };
    } catch (e: any) {
      if (e.userCancelled) {
        return { success: false };
      }
      return { success: false, error: e.message || 'Purchase failed. Please try again.' };
    } finally {
      setIsPurchasing(false);
    }
  };

  const restorePurchases = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      const premium = hasPremiumEntitlement(customerInfo);
      setIsPremium(premium);
      if (!premium) {
        return { success: false, error: 'No active subscription found for this account.' };
      }

      const productId = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.productIdentifier;
      const verification = await verifyWithBackend(productId);
      if (verification && !verification.is_premium) {
        return { success: false, error: 'We could not verify this subscription with RevenueCat. Please contact support.' };
      }

      setPaywallVisible(false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Restore failed. Please try again.' };
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        isReady,
        currentOffering,
        paywallVisible,
        isPurchasing,
        showPaywall,
        hidePaywall,
        purchasePackage,
        restorePurchases,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
