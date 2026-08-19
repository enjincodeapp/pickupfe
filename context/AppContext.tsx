import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  db,
  User,
  Listing,
  Category,
  Favorite,
  ListingImage,
  Conversation,
  Message,
} from '../services/database';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';

interface AppContextType {
  currentUser: User | null;
  categories: Category[];
  listings: Listing[];
  favorites: Favorite[];
  allImages: ListingImage[];
  conversations: Conversation[];
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (userData: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshData: () => Promise<void>;
  updateLocation: (latitude: number, longitude: number, neighborhood?: string) => Promise<{ success: boolean; error?: string }>;
  createListing: (params: {
    title: string;
    description: string;
    category_id: string;
    condition: 'Good' | 'Bad';
    images: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  toggleFavorite: (listing_id: string) => Promise<boolean>;
  isFavorite: (listing_id: string) => boolean;
  getImagesForListing: (listing_id: string) => string[];
  getMessages: (conversation_id: string) => Promise<Message[]>;
  sendMessage: (conversation_id: string, text: string) => Promise<Message>;
  getOrCreateConversation: (listing_id: string, poster_id: string) => Promise<Conversation>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [allImages, setAllImages] = useState<ListingImage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    try {
      let user = null;
      if (await api.isAuthenticated()) {
        try {
          user = await api.getUser();
          await AsyncStorage.setItem('@pickit_current_user', JSON.stringify(user));
          await Purchases.logIn(String(user.id));
        } catch (err) {
          await api.clearToken();
        }
      }
      setCurrentUser(user);

      const cats = await db.getCategories();
      setCategories(cats);

      const list = await db.getListings();
      setListings(list);

      const imgs = await db.getAllListingImages();
      setAllImages(imgs);

      const convs = await db.getConversations();
      setConversations(convs);

      if (user) {
        const favs = await db.getFavorites();
        setFavorites(favs);
      } else {
        setFavorites([]);
      }
    } catch (e) {
      console.error('Error refreshing app data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSignIn = async (email: string, password?: string) => {
    if (!password) return { success: false, error: 'Password is required' };
    try {
      const result = await api.login({ email, password });
      if (result && result.user) {
        setCurrentUser(result.user);
        await AsyncStorage.setItem('@pickit_current_user', JSON.stringify(result.user));
        await Purchases.logIn(String(result.user.id));
        await refreshData();
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Invalid credentials' };
    }
  };

  const handleSignUp = async (userData: any) => {
    try {
      const result = await api.register(userData);
      if (result && result.user) {
        setCurrentUser(result.user);
        await AsyncStorage.setItem('@pickit_current_user', JSON.stringify(result.user));
        await Purchases.logIn(String(result.user.id));
        await refreshData();
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const handleSignOut = async () => {
    await api.logout();
    await AsyncStorage.removeItem('@pickit_current_user');
    await Purchases.logOut();
    setCurrentUser(null);
    setFavorites([]);
    setConversations([]);
  };

  const handleCreateListing = async (params: {
    title: string;
    description: string;
    category_id: string;
    condition: 'Good' | 'Bad';
    images: string[];
  }) => {
    const result = await db.createListing(params);
    if (result.success) {
      await refreshData();
    }
    return result;
  };

  const handleToggleFavorite = async (listing_id: string) => {
    const isFav = await db.toggleFavorite(listing_id);
    const favs = await db.getFavorites();
    setFavorites(favs);
    return isFav;
  };

  const isFavorite = (listing_id: string) => {
    return favorites.some((f) => f.listing_id === listing_id);
  };

  const getImagesForListing = (listing_id: string): string[] => {
    const matched = allImages.filter((img) => img.listing_id === listing_id);
    if (matched.length > 0) {
      return matched.map((m) => m.image);
    }
    return ['img_001.jpg'];
  };

  const getMessages = async (conversation_id: string) => {
    return await db.getMessages(conversation_id);
  };

  const sendMessage = async (conversation_id: string, text: string) => {
    const msg = await db.sendMessage(conversation_id, text);
    const convs = await db.getConversations();
    setConversations(convs);
    return msg;
  };

  const getOrCreateConversation = async (listing_id: string, poster_id: string) => {
    const conv = await db.getOrCreateConversation(listing_id, poster_id);
    const convs = await db.getConversations();
    setConversations(convs);
    return conv;
  };

  const handleUpdateLocation = async (latitude: number, longitude: number, neighborhood?: string) => {
    try {
      if (await api.isAuthenticated()) {
        try {
          const result = await api.updateLocation({ latitude, longitude, neighborhood });
          setCurrentUser(result.user);
          await AsyncStorage.setItem('@pickit_current_user', JSON.stringify(result.user));
          return { success: true };
        } catch {
          // API failed — fall back to local update
        }
      }
      const updated = await db.updateLocation(latitude, longitude, neighborhood || '');
      if (updated) {
        setCurrentUser(updated);
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to update location' };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        categories,
        listings,
        favorites,
        allImages,
        conversations,
        isLoading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        refreshData,
        createListing: handleCreateListing,
        toggleFavorite: handleToggleFavorite,
        isFavorite,
        getImagesForListing,
        getMessages,
        sendMessage,
        getOrCreateConversation,
        updateLocation: handleUpdateLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
