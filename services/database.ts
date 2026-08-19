import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Listing {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category_id: string;
  condition: 'Good' | 'Bad';
  latitude: number;
  longitude: number;
  status: 'available' | 'claimed' | 'completed';
  created_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image: string;
}

export interface Conversation {
  id: string;
  listing_id: string;
  user_id: string;
  poster_id: string;
  created_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at?: string;
}

export interface Claim {
  id: string;
  listing_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  pickup_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'inactive';
  expires_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
}

// Initial Categories
export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Furniture' },
  { id: '2', name: 'Electronics' },
  { id: '3', name: 'Home & Garden' },
  { id: '4', name: 'Others' },
];

// Initial Users Seed
export const DEFAULT_USERS: User[] = [
  {
    id: 'u1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    latitude: 51.516,
    longitude: -0.177,
    neighborhood: 'Paddington, W2',
  },
  {
    id: 'u2',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    password: 'password123',
    latitude: 51.518,
    longitude: -0.175,
    neighborhood: 'Paddington, W2',
  },
];

// Initial Listings Seed
export const DEFAULT_LISTINGS: Listing[] = [
  {
    id: 'l1',
    user_id: 'u2',
    title: 'Velvet Office Chair',
    description: 'In great condition, barely used. Moving house and cannot take it with me. Super comfortable with deep tufting details.',
    category_id: '1', // Furniture
    condition: 'Good',
    latitude: 51.516,
    longitude: -0.177,
    status: 'available',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'l2',
    user_id: 'u2',
    title: 'IKEA Bookshelf',
    description: 'Sturdy wooden bookshelf with 4 shelves. Clean smoke-free home.',
    category_id: '1', // Furniture
    condition: 'Good',
    latitude: 51.518,
    longitude: -0.175,
    status: 'available',
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'l3',
    user_id: 'u1',
    title: 'Retro Record Player',
    description: 'Vintage turntable player in working condition. Includes power supply.',
    category_id: '2', // Electronics
    condition: 'Good',
    latitude: 51.517,
    longitude: -0.174,
    status: 'available',
    created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
  {
    id: 'l4',
    user_id: 'u2',
    title: 'Dining Table Set',
    description: 'Wooden dining table with two chairs. Minor scuffs on table top.',
    category_id: '1', // Furniture
    condition: 'Good',
    latitude: 51.515,
    longitude: -0.179,
    status: 'available',
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
  },
  {
    id: 'l5',
    user_id: 'u1',
    title: 'Kids Bicycle',
    description: 'Red kids bike for ages 5-8. Tires in good shape.',
    category_id: '4', // Others
    condition: 'Good',
    latitude: 51.519,
    longitude: -0.173,
    status: 'available',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
];

// Initial Listing Images Seed
export const DEFAULT_LISTING_IMAGES: ListingImage[] = [
  { id: 'img1', listing_id: 'l1', image: 'img_001.jpg' },
  { id: 'img2', listing_id: 'l2', image: 'img_002.jpg' },
  { id: 'img3', listing_id: 'l3', image: 'img_003.jpg' },
  { id: 'img4', listing_id: 'l4', image: 'img_004.jpg' },
  { id: 'img5', listing_id: 'l5', image: 'img_010.jpg' },
];

// Initial Favorites Seed
export const DEFAULT_FAVORITES: Favorite[] = [
  { id: 'f1', user_id: 'u1', listing_id: 'l1' },
  { id: 'f2', user_id: 'u1', listing_id: 'l2' },
];

// Initial Conversations Seed
export const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    listing_id: 'l1',
    user_id: 'u1',
    poster_id: 'u2',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'conv_2',
    listing_id: 'l2',
    user_id: 'u1',
    poster_id: 'u2',
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
];

// Initial Messages Seed
export const DEFAULT_MESSAGES: Message[] = [
  {
    id: 'm1',
    conversation_id: 'conv_1',
    sender_id: 'u1',
    message: 'Hi Sarah! Is the Velvet Office Chair still available for pick up?',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'm2',
    conversation_id: 'conv_1',
    sender_id: 'u2',
    message: 'Hi Jane! Yes it is. I can have it ready by the front door tomorrow afternoon around 2pm.',
    created_at: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'm3',
    conversation_id: 'conv_1',
    sender_id: 'u1',
    message: 'Awesome! I will bring a friend to help load it. See you tomorrow at 2pm! 🎉',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'm4',
    conversation_id: 'conv_2',
    sender_id: 'u1',
    message: 'Hello! I am interested in the IKEA Bookshelf. Is it dissembled?',
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'm5',
    conversation_id: 'conv_2',
    sender_id: 'u2',
    message: 'Hi Jane! No it is fully assembled, but I can help carry it down to your car.',
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
];

const KEYS = {
  USERS: '@pickit_users',
  CURRENT_USER: '@pickit_current_user',
  LISTINGS: '@pickit_listings',
  LISTING_IMAGES: '@pickit_listing_images',
  CATEGORIES: '@pickit_categories',
  CONVERSATIONS: '@pickit_conversations',
  MESSAGES: '@pickit_messages',
  CLAIMS: '@pickit_claims',
  SUBSCRIPTIONS: '@pickit_subscriptions',
  FAVORITES: '@pickit_favorites',
};

class DatabaseService {
  private initialized = false;

  async initDatabase() {
    if (this.initialized) return;
    try {
      const users = await AsyncStorage.getItem(KEYS.USERS);
      if (!users) {
        await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      }
      const currentUser = await AsyncStorage.getItem(KEYS.CURRENT_USER);
      if (!currentUser) {
        await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
      }
      const categories = await AsyncStorage.getItem(KEYS.CATEGORIES);
      if (!categories) {
        await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      }
      const listings = await AsyncStorage.getItem(KEYS.LISTINGS);
      if (!listings) {
        await AsyncStorage.setItem(KEYS.LISTINGS, JSON.stringify(DEFAULT_LISTINGS));
      }
      const images = await AsyncStorage.getItem(KEYS.LISTING_IMAGES);
      if (!images) {
        await AsyncStorage.setItem(KEYS.LISTING_IMAGES, JSON.stringify(DEFAULT_LISTING_IMAGES));
      }
      const favorites = await AsyncStorage.getItem(KEYS.FAVORITES);
      if (!favorites) {
        await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(DEFAULT_FAVORITES));
      }
      const conversations = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
      if (!conversations) {
        await AsyncStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(DEFAULT_CONVERSATIONS));
      }
      const messages = await AsyncStorage.getItem(KEYS.MESSAGES);
      if (!messages) {
        await AsyncStorage.setItem(KEYS.MESSAGES, JSON.stringify(DEFAULT_MESSAGES));
      }
      this.initialized = true;
    } catch (e) {
      console.error('Database init error:', e);
    }
  }

  // --- USER AUTHENTICATION ---
  async getCurrentUser(): Promise<User | null> {
    await this.initDatabase();
    const data = await AsyncStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  async getUserById(id: string): Promise<User | null> {
    await this.initDatabase();
    const data = await AsyncStorage.getItem(KEYS.USERS);
    const users: User[] = data ? JSON.parse(data) : [];
    return users.find((u) => u.id === id) || null;
  }

  async signIn(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await this.initDatabase();
    const usersData = await AsyncStorage.getItem(KEYS.USERS);
    const users: User[] = usersData ? JSON.parse(usersData) : [];
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      const newUser: User = {
        id: 'u_' + Date.now(),
        name: email.split('@')[0] || 'User',
        email,
        password: password || 'password',
        latitude: 51.516,
        longitude: -0.177,
        neighborhood: 'Paddington, W2',
      };
      users.push(newUser);
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
      return { success: true, user: newUser };
    }

    await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    return { success: true, user };
  }

  async signUp(userData: Omit<User, 'id'>): Promise<{ success: boolean; user?: User; error?: string }> {
    await this.initDatabase();
    const usersData = await AsyncStorage.getItem(KEYS.USERS);
    const users: User[] = usersData ? JSON.parse(usersData) : [];

    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(existing));
      return { success: true, user: existing };
    }

    const newUser: User = {
      ...userData,
      id: 'u_' + Date.now(),
      latitude: userData.latitude || 51.516,
      longitude: userData.longitude || -0.177,
      neighborhood: userData.neighborhood || 'Paddington, W2',
    };
    users.push(newUser);
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
    await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }

  async signOut() {
    await AsyncStorage.removeItem(KEYS.CURRENT_USER);
  }

  async updateLocation(latitude: number, longitude: number, neighborhood: string): Promise<User | null> {
    await this.initDatabase();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser: User = { ...currentUser, latitude, longitude, neighborhood };
    await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updatedUser));

    const usersData = await AsyncStorage.getItem(KEYS.USERS);
    const users: User[] = usersData ? JSON.parse(usersData) : [];
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx >= 0) {
      users[idx] = updatedUser;
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
    }

    return updatedUser;
  }

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    await this.initDatabase();
    const data = await AsyncStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  }

  // --- LISTINGS & LISTING IMAGES ---
  async getListings(): Promise<Listing[]> {
    await this.initDatabase();
    const data = await AsyncStorage.getItem(KEYS.LISTINGS);
    return data ? JSON.parse(data) : [];
  }

  async getListingById(id: string): Promise<Listing | null> {
    const listings = await this.getListings();
    return listings.find((l) => l.id === id) || null;
  }

  async getListingImages(listing_id: string): Promise<ListingImage[]> {
    await this.initDatabase();
    const data = await AsyncStorage.getItem(KEYS.LISTING_IMAGES);
    const images: ListingImage[] = data ? JSON.parse(data) : [];
    return images.filter((img) => img.listing_id === listing_id);
  }

  async getAllListingImages(): Promise<ListingImage[]> {
    await this.initDatabase();
    const data = await AsyncStorage.getItem(KEYS.LISTING_IMAGES);
    return data ? JSON.parse(data) : [];
  }

  async createListing(params: {
    title: string;
    description: string;
    category_id: string;
    condition: 'Good' | 'Bad';
    images: string[];
    latitude?: number;
    longitude?: number;
  }): Promise<{ success: boolean; listing?: Listing; error?: string }> {
    await this.initDatabase();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    if (!params.images || params.images.length === 0) {
      return { success: false, error: 'At least 1 image upload is required.' };
    }

    if (params.images.length > 3) {
      return { success: false, error: 'Maximum of 3 photos allowed.' };
    }

    const listing_id = 'l_' + Date.now();
    const newListing: Listing = {
      id: listing_id,
      user_id: currentUser.id,
      title: params.title,
      description: params.description,
      category_id: params.category_id,
      condition: params.condition,
      latitude: params.latitude || currentUser.latitude || 51.516,
      longitude: params.longitude || currentUser.longitude || -0.177,
      status: 'available',
      created_at: new Date().toISOString(),
    };

    const listings = await this.getListings();
    listings.unshift(newListing);
    await AsyncStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings));

    const imagesData = await AsyncStorage.getItem(KEYS.LISTING_IMAGES);
    const allImages: ListingImage[] = imagesData ? JSON.parse(imagesData) : [];

    params.images.forEach((imgUrl, index) => {
      allImages.push({
        id: `img_${listing_id}_${index}`,
        listing_id,
        image: imgUrl,
      });
    });

    await AsyncStorage.setItem(KEYS.LISTING_IMAGES, JSON.stringify(allImages));
    return { success: true, listing: newListing };
  }

  // --- FAVORITES ---
  async getFavorites(): Promise<Favorite[]> {
    await this.initDatabase();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];
    const data = await AsyncStorage.getItem(KEYS.FAVORITES);
    const allFavs: Favorite[] = data ? JSON.parse(data) : [];
    return allFavs.filter((f) => f.user_id === currentUser.id);
  }

  async toggleFavorite(listing_id: string): Promise<boolean> {
    await this.initDatabase();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return false;

    const data = await AsyncStorage.getItem(KEYS.FAVORITES);
    let allFavs: Favorite[] = data ? JSON.parse(data) : [];
    const existingIndex = allFavs.findIndex((f) => f.user_id === currentUser.id && f.listing_id === listing_id);

    let isFav = false;
    if (existingIndex >= 0) {
      allFavs.splice(existingIndex, 1);
      isFav = false;
    } else {
      allFavs.push({
        id: 'f_' + Date.now(),
        user_id: currentUser.id,
        listing_id,
      });
      isFav = true;
    }

    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(allFavs));
    return isFav;
  }

  // --- CONVERSATIONS & MESSAGES ---
  async getConversations(): Promise<Conversation[]> {
    await this.initDatabase();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return [];
    const data = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
    const allConvs: Conversation[] = data ? JSON.parse(data) : [];
    return allConvs.filter(
      (c) => c.user_id === currentUser.id || c.poster_id === currentUser.id
    );
  }

  async getOrCreateConversation(listing_id: string, poster_id: string): Promise<Conversation> {
    await this.initDatabase();
    const currentUser = await this.getCurrentUser();
    const currentUserId = currentUser ? currentUser.id : 'u1';

    const data = await AsyncStorage.getItem(KEYS.CONVERSATIONS);
    const allConvs: Conversation[] = data ? JSON.parse(data) : [];

    const existing = allConvs.find(
      (c) => c.listing_id === listing_id && (
        (c.user_id === currentUserId && c.poster_id === poster_id) ||
        (c.user_id === poster_id && c.poster_id === currentUserId)
      )
    );

    if (existing) return existing;

    const newConv: Conversation = {
      id: 'conv_' + Date.now(),
      listing_id,
      user_id: currentUserId,
      poster_id,
      created_at: new Date().toISOString(),
    };

    allConvs.unshift(newConv);
    await AsyncStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(allConvs));
    return newConv;
  }

  async getMessages(conversation_id: string): Promise<Message[]> {
    await this.initDatabase();
    const data = await AsyncStorage.getItem(KEYS.MESSAGES);
    const allMsgs: Message[] = data ? JSON.parse(data) : [];
    return allMsgs.filter((m) => m.conversation_id === conversation_id);
  }

  async sendMessage(conversation_id: string, messageText: string): Promise<Message> {
    await this.initDatabase();
    const currentUser = await this.getCurrentUser();
    const senderId = currentUser ? currentUser.id : 'u1';

    const data = await AsyncStorage.getItem(KEYS.MESSAGES);
    const allMsgs: Message[] = data ? JSON.parse(data) : [];

    const newMsg: Message = {
      id: 'm_' + Date.now(),
      conversation_id,
      sender_id: senderId,
      message: messageText,
      created_at: new Date().toISOString(),
    };

    allMsgs.push(newMsg);
    await AsyncStorage.setItem(KEYS.MESSAGES, JSON.stringify(allMsgs));
    return newMsg;
  }

  // --- CLAIMS ---
  async createClaim(listing_id: string): Promise<Claim | null> {
    await this.initDatabase();
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return null;

    const data = await AsyncStorage.getItem(KEYS.CLAIMS);
    const claims: Claim[] = data ? JSON.parse(data) : [];

    const newClaim: Claim = {
      id: 'c_' + Date.now(),
      listing_id,
      user_id: currentUser.id,
      status: 'pending',
      pickup_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };

    claims.push(newClaim);
    await AsyncStorage.setItem(KEYS.CLAIMS, JSON.stringify(claims));
    return newClaim;
  }
}

export const db = new DatabaseService();
