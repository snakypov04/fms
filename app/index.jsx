import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton'; // Importing the custom button

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to Farmers Market App!</Text>
      <Text style={styles.subtitle}>The best products from local farms</Text>
      {/* Use the custom Button component */}
      <CustomButton 
        title="Get Started" 
        onPress={() => router.push('login')} 
        style={styles.button} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7',
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 40, // Optional: Override or extend the default button styles
  },
});
