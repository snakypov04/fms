import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getProfile, login } from '../../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    console.log('Email:', email, 'Password:', password);
    try{
      await login(email, password)
    }catch (error){
      console.error(error)
      throw error
    }

    const {role} = await getProfile()
    console.log(role)
    if (role === "Farmer"){
      navigateToFarmerPage()
    }else if(role === "Buyer"){
      navigateToBuyerPage()
    }else{
      throw error
    }
    
  };

  const navigateToBuyerRegistration = () => {
    router.push('/(auth)/registerBuyer');
  };

  const navigateToFarmerRegistration = () => {
    router.push('/(auth)/registerFarmer');
  };

  const navigateToBuyerPage = () => {
    router.push('/(buyer)/Profile'); // Navigate to the Buyer section
  };

  const navigateToFarmerPage = () => {
    router.push('/(farmer)/Profile'); // Navigate to the Farmer section
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authorise</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.dividerText}>Don't have an account?</Text>

      {/* Registration Buttons */}
      <TouchableOpacity style={styles.registerButton} onPress={navigateToBuyerRegistration}>
        <Text style={styles.registerButtonText}>Register as a Buyer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={navigateToFarmerRegistration}>
        <Text style={styles.registerButtonText}>Register as a Farmer</Text>
      </TouchableOpacity>

      {/* Temporary Navigation Buttons */}
      <Text style={styles.dividerText}>Temporary Navigation:</Text>
      <TouchableOpacity style={styles.temporaryButton} onPress={navigateToBuyerPage}>
        <Text style={styles.temporaryButtonText}>Go to Buyer Page</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.temporaryButton} onPress={navigateToFarmerPage}>
        <Text style={styles.temporaryButtonText}>Go to Farmer Page</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
  registerButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  registerButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  temporaryButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  temporaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
