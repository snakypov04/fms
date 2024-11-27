import { Stack } from 'expo-router';
import 'react-native-reanimated';

export default function AuthLayout() {
  return (
    <Stack>
      {/* Login Screen */}
      <Stack.Screen name="login" options={{ headerShown: false }} />

      {/* Register Buyer Screen */}
      <Stack.Screen name="registerBuyer" options={{ headerShown: false }} />

      {/* Register Farmer Screen */}
      <Stack.Screen name="registerFarmer" options={{ headerShown: false }} />
    </Stack>
  );
}
