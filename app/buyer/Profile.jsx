import React, { useState, useEffect, useCallback } from "react";
import { Picker } from "@react-native-picker/picker";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	RefreshControl,
	Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // For avatar upload
import { getProfile, updateBuyerProfile } from "../../api/auth";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

export default function Profile() {
	const [userData, setUserData] = useState({
		first_name: "",
		last_name: "",
		email: "example@example.com",
		phone: "",
		delivery_address: "",
		payment_method: "",
		avatar: null,
	});
	const [errors, setErrors] = useState({});

	const [refreshing, setRefreshing] = useState(false);

	const fetchProfile = async () => {
		try {
			const data = await getProfile(); // Await the profile data
			console.log("Fetched Profile Data:", data);

			if (data) {
				setUserData((prevState) => ({
					...prevState, // Preserve the existing state
					first_name: data.first_name || "", // Update the 'name' field
					last_name: data.last_name || "", // Update the 'surname' field
					email: data.email || "example@example.com", // Update the 'email' field
					phone: data.phone || "", // Update the 'phone' field
					delivery_address: data.info?.delivery_address || "", // Update the 'address' field (handle nested objects safely)
					payment_method: data.info?.payment_method || "", // Update the 'paymentMethod' field
					avatar: data.avatar || "",
				}));
			}
		} catch (error) {
			console.error("Error fetching profile:", error.message);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchProfile();
		}, [])
	);

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
		// Clear the error for this field
		setErrors((prevErrors) => ({
			...prevErrors,
			[field]: null,
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

				console.log("Avatar updated to:", avatarUri); // Debugging log
			} else {
				console.log("Image picker canceled");
			}
		} catch (error) {
			console.error("Error uploading avatar:", error.message);
		}
	};

	const validateFields = () => {
		const newErrors = {};

		if (!userData.first_name.trim()) newErrors.first_name = "Name is required.";
		if (!userData.last_name.trim()) newErrors.last_name = "Surname is required.";
		if (!userData.phone.trim()) newErrors.phone = "Phone number is required.";
		if (!userData.delivery_address.trim())
			newErrors.delivery_address = "Delivery address is required.";
		if (!userData.payment_method.trim())
			newErrors.payment_method = "Payment method is required.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0; // Return true if no errors
	};

	// Simulate saving the profile to a database
	const saveProfile = async () => {
		if (!validateFields()) {
			Alert.alert("Validation Error", "Please fill in all required fields.");
			return;
		}

		const profileData = {
			first_name: userData.first_name.trim(),
			last_name: userData.last_name.trim(),
			email: userData.email.trim(),
			phone: userData.phone.trim(),
			delivery_address: userData.delivery_address.trim(),
			payment_method: userData.payment_method.trim(),
			avatar: userData.avatar,
		};

		try {
			await updateBuyerProfile(profileData);
			Alert.alert("Success", "Profile saved successfully!");
		} catch (error) {
			console.error("Error saving profile:", error);
			Alert.alert("Error", "Failed to save profile.");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1, padding: 20 }}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<View style={styles.avatarContainer}>
					<TouchableOpacity onPress={handleAvatarUpload}>
						<Image
							source={userData.avatar ? { uri: userData.avatar } : require('../../assets/images/default-avatar.png')}
							style={styles.avatar}
						/>
						<Text style={styles.avatarText}>Upload Avatar</Text>
					</TouchableOpacity>
				</View>

				{/* Name Field */}
				<View style={styles.fieldContainer}>
					<Text style={styles.label}>Name</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your name"
						value={userData.first_name}
						onChangeText={(text) => handleInputChange("first_name", text)}
					/>
					{errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}
				</View>

				{/* Surname Field */}
				<View style={styles.fieldContainer}>
					<Text style={styles.label}>Surname</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your surname"
						value={userData.last_name}
						onChangeText={(text) => handleInputChange("last_name", text)}
					/>
					{errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
				</View>

				{/* Email Field */}
				<View style={styles.fieldContainer}>
					<Text style={styles.label}>Email</Text>
					<TextInput
						style={[styles.input, styles.disabledInput]}
						value={userData.email}
						editable={false}
					/>
				</View>

				{/* Phone Field */}
				<View style={styles.fieldContainer}>
					<Text style={styles.label}>Phone</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your phone number"
						value={userData.phone}
						onChangeText={(text) => handleInputChange("phone", text)}
					/>
					{errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
				</View>

				{/* Delivery Address Field */}
				<View style={styles.fieldContainer}>
					<Text style={styles.label}>Delivery Address</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your delivery address"
						value={userData.delivery_address}
						onChangeText={(text) => handleInputChange("delivery_address", text)}
					/>
					{errors.delivery_address && (
						<Text style={styles.errorText}>{errors.delivery_address}</Text>
					)}
				</View>

				{/* Payment Method Picker */}
				<View style={styles.fieldContainer}>
					<Text style={styles.label}>Payment Method</Text>
					<Picker
						selectedValue={userData.payment_method}
						onValueChange={(value) => handleInputChange("payment_method", value)}
						style={styles.picker}
					>
						<Picker.Item label="Select a payment method" value="" />
						<Picker.Item label="Cash" value="Cash" />
						<Picker.Item label="Card" value="Card" />
						<Picker.Item label="QR" value="QR" />
					</Picker>
					{errors.payment_method && (
						<Text style={styles.errorText}>{errors.payment_method}</Text>
					)}
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
		backgroundColor: "#f7f7f7",
	},
	avatarContainer: {
		alignItems: "center",
		marginBottom: 20,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
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
