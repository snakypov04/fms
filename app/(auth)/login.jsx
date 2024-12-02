import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getProfile, login } from '../../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');  // Add state for error message
  const router = useRouter();

  const handleLogin = async () => {
    console.log('Email:', email, 'Password:', password);
    setLoginError(''); // Reset any previous error message

    try {
      // Attempt to log in
      await login(email, password);
      
      // If login is successful, get user profile
      const { role } = await getProfile();
      console.log(role);

      // Redirect based on user role
      if (role === 'Farmer') {
        router.push('/farmer/Profile');
      } else if (role === 'Buyer') {
        router.push('/buyer/Profile');
      } else {
        setLoginError('Unexpected role: ' + role);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        // If status code 401, email or password is incorrect
        setLoginError('Email or password is incorrect');
      } else if (error.response && error.response.status === 400) {
        setLoginError('Please enter your email and password');
      } else {
        // Handle other types of errors (e.g., network errors)
        setLoginError('An error occurred, please try again later');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authorize</Text>
      
      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {/* Login button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Show error message if login failed */}
      {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

      {/* Divider */}
      <Text style={styles.dividerText}>Don't have an account?</Text>

      {/* Registration Buttons */}
      <TouchableOpacity style={styles.registerButton} onPress={() => router.push('/(auth)/registerBuyer')}>
        <Text style={styles.registerButtonText}>Register as a Buyer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => router.push('/(auth)/registerFarmer')}>
        <Text style={styles.registerButtonText}>Register as a Farmer</Text>
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
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});
