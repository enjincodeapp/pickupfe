import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
} from 'react-native-purchases';
import { REVENUECAT_API_KEY, PREMIUM_ENTITLEMENT_ID } from '../constants/revenuecat';

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

  const purchasePackage = async (pkg: PurchasesPackage) => {
    if (isPurchasing) return { success: false };
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const premium = hasPremiumEntitlement(customerInfo);
      setIsPremium(premium);
      if (premium) {
        setPaywallVisible(false);
      }
      return { success: premium };
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
      if (premium) {
        setPaywallVisible(false);
        return { success: true };
      }
      return { success: false, error: 'No active subscription found for this account.' };
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
