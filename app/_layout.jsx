import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-reanimated';

// Prevent splash screen from hiding before assets are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
    RobotoRegular: require('../assets/fonts/Roboto-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Hide splash screen once fonts are loaded
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // Return a fallback component (can be a spinner or empty placeholder)
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Root Navigator for the app */}
      <Stack>
        {/* Index route (entry point) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Authentication screens layout */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />

        {/* Buyer-specific layout */}
        <Stack.Screen name="(buyer)" options={{ headerShown: false }} />

        {/* Farmer-specific layout */}
        <Stack.Screen name="(farmer)" options={{ headerShown: false }} />
      </Stack>

      {/* Status bar for system UI */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
