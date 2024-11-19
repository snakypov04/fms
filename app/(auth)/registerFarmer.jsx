import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../../components/CustomButton'; // Import CustomButton
import { Ionicons } from '@expo/vector-icons'; // For the eye icon
import * as DocumentPicker from 'expo-document-picker'; // For document upload

export default function RegisterFarmer() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [document, setDocument] = useState(null);
  const router = useRouter();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Function to pick a document
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Accept all file types; adjust as needed
        copyToCacheDirectory: true,
      });
      if (result.type === 'success') {
        setDocument(result); // Save the document info
        console.log('Document selected:', result);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleRegister = () => {
    if (!document) {
      alert('Please upload a document to verify your farm.');
      return;
    }
    console.log('Registering Farmer with document:', document);
    router.push('/(auth)/login'); // Navigate back to login after registration
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register as a Farmer</Text>
      <TextInput style={styles.input} placeholder="Full Name" />
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Farm Name" />
      <TextInput style={styles.input} placeholder="Location" />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeButton}>
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
      {/* Document Upload */}
      <View style={styles.documentContainer}>
        <CustomButton
          title="Upload Verification Document"
          onPress={pickDocument}
          style={styles.uploadButton}
        />
        {document && (
          <Text style={styles.documentText}>
            Selected: {document.name} ({(document.size / 1024).toFixed(2)} KB)
          </Text>
        )}
      </View>
      <CustomButton title="Register" onPress={handleRegister} />
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  eyeButton: {
    padding: 10,
  },
  documentContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButton: {
    marginBottom: 10,
  },
  documentText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
