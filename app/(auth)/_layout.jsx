import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export default function authLayout() {

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="registerBuyer" options={{ headerShown: false }} />
      <Stack.Screen name="registerFarmer" options={{ headerShown: false }} />
    </Stack>
  );
}
