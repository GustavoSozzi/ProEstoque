import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/src/constants/theme';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { ProductsProvider } from '@/src/contexts/ProductsContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

// ─── Navigation Guard ────────────────────────────────────────────────────────

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return null;
}

// ─── Root Layout ─────────────────────────────────────────────────────────────

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.appBackground }}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavigationGuard />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <RootLayoutNav />
      </ProductsProvider>
    </AuthProvider>
  );
}
