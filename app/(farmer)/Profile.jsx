import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const initialFarmerData = {
  id: 5,
  email: "farmer@gmail.com",
  first_name: "",
  last_name: "",
  phone: "",
  avatar: null,
  role: "Farmer",
  info: {
    rating: 0.0,
    experience: 0,
    bio: "",
  },
  socials: [],
};

export default function FarmerProfile() {
  const [avatar, setAvatar] = useState(initialFarmerData.avatar);
  const [firstName, setFirstName] = useState(initialFarmerData.first_name);
  const [lastName, setLastName] = useState(initialFarmerData.last_name);
  const [email, setEmail] = useState(initialFarmerData.email);
  const [phone, setPhone] = useState(initialFarmerData.phone);
  const [bio, setBio] = useState(initialFarmerData.info.bio);
  const [experience, setExperience] = useState(initialFarmerData.info.experience);
  const [rating, setRating] = useState(initialFarmerData.info.rating);
  const [socials, setSocials] = useState(initialFarmerData.socials);

  const handleAvatarUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const addSocial = () => {
    const newSocial = {
      id: socials.length + 1,
      platform: "",
      url: "",
    };
    setSocials([...socials, newSocial]);
  };

  const updateSocial = (index, key, value) => {
    const updatedSocials = [...socials];
    updatedSocials[index][key] = value;
    setSocials(updatedSocials);
  };

  const saveProfile = () => {
    const updatedProfile = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      avatar,
      info: {
        rating,
        experience,
        bio,
      },
      socials,
    };

    console.log("Saving profile to database:", updatedProfile);
    alert("Profile saved successfully!");
  };

  const openSocialLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleAvatarUpload}>
          <Image
            source={avatar ? { uri: avatar } : require('../../assets/images/default-avatar.png')}
            style={styles.avatar}
          />
          <Text style={styles.avatarText}>Upload Avatar</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Fields */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your bio"
          value={bio}
          onChangeText={setBio}
        />

        <Text style={styles.label}>Experience (Years)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your experience"
          value={String(experience)}
          keyboardType="numeric"
          onChangeText={(value) => setExperience(Number(value))}
        />

        <Text style={styles.label}>Rating</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your rating"
          value={String(rating)}
          keyboardType="numeric"
          onChangeText={(value) => setRating(Number(value))}
        />
      </View>

      {/* Social Links */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Social Links</Text>
        {socials.map((social, index) => (
          <View key={social.id} style={styles.socialRow}>
            <TextInput
              style={[styles.input, styles.socialInput]}
              placeholder="Platform (e.g., Facebook)"
              value={social.platform}
              onChangeText={(value) => updateSocial(index, "platform", value)}
            />
            <TextInput
              style={[styles.input, styles.socialInput]}
              placeholder="URL (e.g., https://facebook.com)"
              value={social.url}
              onChangeText={(value) => updateSocial(index, "url", value)}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.addSocialButton} onPress={addSocial}>
          <Text style={styles.addSocialButtonText}>Add Social Link</Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#e0e0e0",
  },
  avatarText: {
    marginTop: 10,
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#e0e0e0",
    color: "#999",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  socialInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  addSocialButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addSocialButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
