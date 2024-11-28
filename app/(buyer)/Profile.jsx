import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // For avatar upload
import { getProfile, updateProfile } from '../../api/auth';

export default function Profile() {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: 'example@example.com',
    phone: '',
    delivery_address: '',
    payment_method: '',
    avatar: null,
  });

  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await getProfile(); // Await the profile data
      console.log('Fetched Profile Data:', data);

      if (data) {
        setUserData((prevState) => ({
          ...prevState, // Preserve the existing state
          first_name: data.first_name || '', // Update the 'name' field
          last_name: data.last_name || '', // Update the 'surname' field
          email: data.email || 'example@example.com', // Update the 'email' field
          phone: data.phone || '', // Update the 'phone' field
          delivery_address: data.info?.delivery_address || '', // Update the 'address' field (handle nested objects safely)
          payment_method: data.info?.payment_method || '', // Update the 'paymentMethod' field
          avatar: data.avatar || '',
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
    }
  };

  useEffect(() => {

    fetchProfile();
  }, []);

  const onRefresh = async () => {
		setRefreshing(true);
		await fetchProfile(); // Fetch new data
		setRefreshing(false);
	};


  const handleInputChange = (field, value) => {
    setUserData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };


  const handleAvatarUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // 
        quality: 1, // Highest quality
      });
  
      if (!result.canceled) {
        const avatarUri = result.assets[0].uri; // Get the URI of the selected image
  
        // Update the avatar in userData
        setUserData((prevState) => ({
          ...prevState,
          avatar: avatarUri, // Update the avatar field
        }));
  
        console.log('Avatar updated to:', avatarUri); // Debugging log
      } else {
        console.log('Image picker canceled');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
    }
  };

  // Simulate saving the profile to a database
  const saveProfile = async () => {
    const profileData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone: userData.phone,
      delivery_address: userData.delivery_address,
      payment_method: userData.payment_method,
      avatar: userData.avatar,
    };

    updateProfile(profileData)

    console.log('Saving profile to database:', profileData);
    // alert('Profile saved successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleAvatarUpload}>
            <Image
              source={userData.avatar ? { uri: userData.avatar } : require('../../assets/images/default-avatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.avatarText}>Upload Avatar</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={userData.first_name}
            onChangeText={(text) => handleInputChange('first_name', text)}
          />

          <Text style={styles.label}>Surname</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your surname"
            value={userData.last_name}
            onChangeText={(text) => handleInputChange('last_name', text)}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={userData.email}
            editable={false}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={userData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
          />

          <Text style={styles.label}>Delivery Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your delivery address"
            value={userData.delivery_address}
            onChangeText={(text) => handleInputChange('delivery_address', text)}
          />

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={userData.payment_method} // Bind to the correct state
                onValueChange={(value) => handleInputChange('payment_method', value)} // Update state on change
                style={styles.picker}
              >
                <Picker.Item label="Select a payment method" value="" />
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="Card" value="Card" />
                <Picker.Item label="QR" value="QR" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#e0e0e0',
  },
  avatarText: {
    marginTop: 10,
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#e0e0e0',
    color: '#999',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
