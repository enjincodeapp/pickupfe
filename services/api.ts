import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android emulator, localhost for iOS/web
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.101.22:8000/api';
  }
  return 'http://192.168.101.22:8000/api';
};

const API_BASE = getBaseUrl();
const TOKEN_KEY = '@pickit_api_token';

class ApiService {
  private token: string | null = null;

  /**
   * Load the stored auth token from AsyncStorage.
   */
  async loadToken(): Promise<string | null> {
    if (this.token) return this.token;
    this.token = await AsyncStorage.getItem(TOKEN_KEY);
    return this.token;
  }

  /**
   * Store the auth token.
   */
  async setToken(token: string): Promise<void> {
    this.token = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Remove the auth token.
   */
  async clearToken(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  /**
   * Make an authenticated API request.
   */
  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    await this.loadToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.message ||
        (data.errors
          ? Object.values(data.errors).flat().join('\n')
          : 'Something went wrong');
      throw new Error(errorMessage);
    }

    return data;
  }

  // ─── Auth Endpoints ────────────────────────────────────────

  /**
   * Register a new user.
   */
  async register(params: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ user: any; token: string }> {
    const data = await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    await this.setToken(data.token);
    return data;
  }

  /**
   * Login with email and password.
   */
  async login(params: {
    email: string;
    password: string;
  }): Promise<{ user: any; token: string }> {
    const data = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    await this.setToken(data.token);
    return data;
  }

  /**
   * Get the authenticated user.
   */
  async getUser(): Promise<any> {
    return await this.request('/user');
  }

  /**
   * Logout and revoke token.
   */
  async logout(): Promise<void> {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch {
      // Token might already be invalid
    }
    await this.clearToken();
  }

  /**
   * Send a password reset link.
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return await this.request('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Reset password with token.
   */
  async resetPassword(params: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string }> {
    return await this.request('/reset-password', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Check if a token exists (user might be logged in).
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.loadToken();
    return !!token;
  }

  // ─── Subscription Endpoints ────────────────────────────────

  /**
   * Get the user's subscription/premium status.
   */
  async getSubscriptionStatus(): Promise<{
    is_premium: boolean;
    plan: string | null;
    expires_at: string | null;
  }> {
    return await this.request('/subscription/status');
  }

  /**
   * Ask the backend to verify a just-completed purchase directly against
   * RevenueCat and persist the verified subscription state.
   */
  async verifySubscription(params: {
    product_id?: string;
    transaction_id?: string;
  }): Promise<{
    verified: boolean;
    is_premium: boolean;
    plan?: string | null;
    expires_at?: string | null;
    message?: string;
  }> {
    return await this.request('/subscription/verify', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Toggle premium status (dev/testing only).
   */
  async togglePremium(): Promise<{
    is_premium: boolean;
    message: string;
  }> {
    return await this.request('/subscription/toggle-premium', {
      method: 'POST',
    });
  }

  // ─── User Profile Endpoints ─────────────────────────────────

  /**
   * Update the authenticated user's location.
   */
  async updateLocation(params: {
    latitude: number;
    longitude: number;
    neighborhood?: string;
  }): Promise<{ message: string; user: any }> {
    return await this.request('/user/location', {
      method: 'PATCH',
      body: JSON.stringify(params),
    });
  }
}

export const api = new ApiService();
