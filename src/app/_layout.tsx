import { ThemeProvider } from "@/context/ThemedContext";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/expo";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// 1. Create an inner layout or component to handle auth routing
function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && inAuthGroup) {
      // Redirect to main app / onboarding once signed in
      router.replace("/(auth)/onboarding"); // Update this to your main app route
    } else if (!isSignedIn && !inAuthGroup) {
      // Redirect to sign in if not authenticated
      router.replace("/(auth)/login"); // Update to your auth route
    }
  }, [isSignedIn, isLoaded]);

  if (!isLoaded) {
    return null; // Return a loading spinner if desired
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

// 2. RootLayout only initializes the Providers
export default function RootLayout() {
  if (!publishableKey) {
    throw new Error("Add your Clerk Publishable Key to the .env file");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider>
          <InitialLayout />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
