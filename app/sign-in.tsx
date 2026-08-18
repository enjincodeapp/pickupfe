import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useApp();

  const handleSignIn = async () => {
    if (loading) return;
    if (!email) {
      Alert.alert('Required', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const result = await signIn(email.trim().toLowerCase(), password);
      if (result.success) {
        // navigation away will unmount this component
        router.replace('/(tabs)');
        return;
      } else {
        Alert.alert('Sign In Failed', result.error || 'Please check your credentials.');
      }
    } catch (err) {
      console.error('SignIn error', err);
      Alert.alert('Sign In Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero strip of item images */}
        <View style={styles.heroStrip}>
          <Image source={require('../assets/images/items/img_001.jpg')} style={styles.heroImg} />
          <Image source={require('../assets/images/items/img_002.jpg')} style={styles.heroImg} />
          <Image source={require('../assets/images/items/img_003.jpg')} style={styles.heroImg} />
          <Image source={require('../assets/images/items/img_004.jpg')} style={styles.heroImg} />
        </View>
        <View style={styles.overlay} />

        <View style={styles.card}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Free stuff from neighbours near you</Text>
          {/* 
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>100% FREE</Text>
          </View> */}

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => { }}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnPrimaryDisabled]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>or</Text>
            <View style={styles.divLine} />
          </View>

          <TouchableOpacity style={styles.btnGoogle}>
            <Text style={styles.btnGoogleText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnApple}>
            <Text style={styles.btnAppleText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/sign-up')}>
            <Text style={styles.signupText}>
              {"Don't have an account? "}<Text style={styles.signupLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scroll: { flexGrow: 1 },
  heroStrip: {
    height: 230,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  heroImg: {
    flex: 1,
    height: 230,
    opacity: 0.75,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 230,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginTop: -30,
    marginHorizontal: 0,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
    flex: 1,
  },
  logo: { width: 350, height: 150, marginBottom: 4 },
  tagline: { fontSize: 15, color: '#4B5563', marginBottom: 9, textAlign: 'center' },
  freeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 24,
  },
  freeBadgeText: { color: '#10B981', fontSize: 12, fontWeight: '700' },
  form: { gap: 12 },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { fontSize: 13, color: '#FF2424', fontWeight: '600' },
  btnPrimary: {
    height: 50,
    backgroundColor: '#FF2424',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  btnPrimaryDisabled: {
    opacity: 0.7,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: '#F3F4F6' },
  divText: { fontSize: 13, color: '#9CA3AF' },
  btnGoogle: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btnGoogleText: { fontSize: 15, color: '#111827', fontWeight: '600' },
  btnApple: {
    height: 50,
    backgroundColor: '#111827',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  btnAppleText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  signupText: { textAlign: 'center', fontSize: 14, color: '#6B7280' },
  signupLink: { color: '#FF2424', fontWeight: '700' },
});
