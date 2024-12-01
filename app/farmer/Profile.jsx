import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getProfile, updateFarmerProfile } from "../../api/auth";

export default function FarmerProfile() {
	const [profileData, setProfileData] = useState({
		id: 0,
		email: "",
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
	});
	const [errors, setErrors] = useState({}); // Track validation errors

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const data = await getProfile();
				setProfileData({
					...profileData,
					...data,
					info: {
						...profileData.info,
						...(data.info || {}),
					},
				});
			} catch (error) {
				console.error("Error fetching profile:", error.message);
				Alert.alert("Error", "Failed to fetch profile.");
			}
		};
		fetchProfile();
	}, []);

	const validateFields = () => {
		const newErrors = {};

		if (!profileData.first_name.trim()) newErrors.first_name = "First name is required.";
		if (!profileData.last_name.trim()) newErrors.last_name = "Last name is required.";
		if (!profileData.phone.trim()) newErrors.phone = "Phone number is required.";
		if (!profileData.info.bio.trim()) newErrors.bio = "Bio is required.";
		if (!profileData.info.experience || isNaN(profileData.info.experience))
			newErrors.experience = "Experience must be a valid number.";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field, value) => {
		setProfileData((prevState) => ({
			...prevState,
			[field]: value,
		}));
		setErrors((prevErrors) => ({
			...prevErrors,
			[field]: null,
		}));
	};

	const handleInfoChange = (field, value) => {
		setProfileData((prevState) => ({
			...prevState,
			info: {
				...prevState.info,
				[field]: value,
			},
		}));
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
				aspect: [1, 1],
				quality: 1,
			});

			if (!result.canceled && result.assets && result.assets.length > 0) {
				setProfileData((prevData) => ({
					...prevData,
					avatar: result.assets[0].uri,
				}));
			} else {
				Alert.alert("Upload Cancelled", "No image selected.");
			}
		} catch (error) {
			console.error("Error uploading avatar:", error.message);
			Alert.alert("Error", "Failed to upload avatar.");
		}
	};

	const saveProfile = async () => {
		if (!validateFields()) {
			Alert.alert("Validation Error", "Please correct the highlighted fields.");
			console.log("Validation Error", "Please correct the highlighted fields.");
			return;
		}

		try {
			await updateFarmerProfile(profileData);
			console.log("Profile updated successfully!");
			Alert.alert("Success", "Profile updated successfully!");
		} catch (error) {
			console.error("Error saving profile:", error);
			Alert.alert("Error", "Failed to save profile.");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
				{/* Avatar Section */}
				<View style={styles.avatarContainer}>
					<TouchableOpacity onPress={handleAvatarUpload}>
						<Image
							source={
								profileData.avatar
									? { uri: profileData.avatar }
									: require("../../assets/images/default-avatar.png")
							}
							style={styles.avatar}
						/>
						<Text style={styles.avatarText}>Upload Avatar</Text>
					</TouchableOpacity>
				</View>

				{/* Input Fields */}
				{["first_name", "last_name", "phone"].map((field) => (
					<View style={styles.fieldContainer} key={field}>
						<Text style={styles.label}>
							{field.replace("_", " ").toUpperCase()}
						</Text>
						<TextInput
							style={styles.input}
							placeholder={`Enter your ${field.replace("_", " ")}`}
							value={profileData[field]}
							onChangeText={(text) => handleInputChange(field, text)}
						/>
						{errors[field] && (
							<Text style={styles.errorText}>{errors[field]}</Text>
						)}
					</View>
				))}

				{/* Bio Field */}
				<View style={styles.fieldContainer}>
					<Text style={styles.label}>Bio</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your bio"
						value={profileData.info.bio}
						onChangeText={(text) => handleInfoChange("bio", text)}
					/>
					{errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
				</View>

				{/* Experience Field */}
				<View style={styles.fieldContainer}>
					<Text style={styles.label}>Experience (Years)</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your experience"
						value={String(profileData.info.experience)}
						keyboardType="numeric"
						onChangeText={(value) =>
							handleInfoChange("experience", parseInt(value, 10) || 0)
						}
					/>
					{errors.experience && (
						<Text style={styles.errorText}>{errors.experience}</Text>
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
		marginBottom: 5,
		backgroundColor: "#fff",
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginTop: 2,
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
