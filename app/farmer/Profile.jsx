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
	Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import { getProfile, addSocials, updateFarmerProfile } from "../../api/auth";

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
		socials: [],
	});

	useEffect(() => {
		// Example of fetching profile data from an API
		const fetchProfile = async () => {
			const data = await getProfile(); // Replace with actual API call
			setProfileData(data);
		};

		fetchProfile();
	}, []);

	const handleAvatarUpload = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setProfileData((prevData) => ({
				...prevData,
				avatar: result.assets[0].uri,
			}));
		}
	};

	const addSocial = () => {
		setProfileData((prevData) => ({
			...prevData,
			socials: [
				...prevData.socials,
				{
					platform: "Facebook",
					url: "",
				},
			],
		}));
	};

	const updateSocial = (index, key, value) => {
		const updatedSocials = [...profileData.socials];

		updatedSocials[index][key] = value;
		setProfileData((prevData) => ({
			...prevData,
			socials: updatedSocials,
		}));
	};

	const saveProfile = async () => {
		for (const social of profileData.socials) {
			try {
				console.log(social);
				// await addSocials(social);
			} catch (error) {
				console.error("Error saving social:", error);
			}
		}

		updateFarmerProfile(profileData)

		console.log("Saving profile to database:", profileData);
		alert("Profile saved successfully!");
	};

	const openSocialLink = (url) => {
		Linking.openURL(url).catch((err) =>
			console.error("Failed to open URL:", err)
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
				{/* Avatar Section */}
				<View style={styles.avatarContainer}>
					<TouchableOpacity onPress={handleAvatarUpload}>
						{/* <Image
							source={avatar ? { uri: avatar } : require('../../assets/images/default-avatar.png')}
							style={styles.avatar}
						/> */}
						<Text style={styles.avatarText}>Upload Avatar</Text>
					</TouchableOpacity>
				</View>

				{/* Profile Fields */}
				<View style={styles.fieldContainer}>
					<Text style={styles.label}>First Name</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your first name"
						value={profileData.first_name ?? ""}
						onChangeText={(text) =>
							setProfileData((prevData) => ({ ...prevData, first_name: text }))
						}
					/>

					<Text style={styles.label}>Last Name</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your last name"
						value={profileData.last_name ?? ""}
						onChangeText={(text) =>
							setProfileData((prevData) => ({ ...prevData, last_name: text }))
						}
					/>

					<Text style={styles.label}>Email</Text>
					<TextInput
						style={[styles.input, styles.disabledInput]}
						value={profileData.email ?? ""}
						editable={false}
					/>

					<Text style={styles.label}>Phone</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your phone number"
						value={profileData.phone ?? ""}
						onChangeText={(text) =>
							setProfileData((prevData) => ({ ...prevData, phone: text }))
						}
					/>

					<Text style={styles.label}>Bio</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your bio"
						value={profileData.info.bio ?? ""}
						onChangeText={(text) =>
							setProfileData((prevData) => ({
								...prevData,
								info: { ...prevData.info, bio: text },
							}))
						}
					/>

					<Text style={styles.label}>Experience (Years)</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your experience"
						value={String(profileData.info.experience) ?? ""}
						keyboardType="numeric"
						onChangeText={(value) =>
							setProfileData((prevData) => ({
								...prevData,
								info: { ...prevData.info, experience: Number(value) },
							}))
						}
					/>

					<Text style={styles.label}>Rating</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your rating"
						value={String(profileData.info.rating) ?? ""}
						keyboardType="numeric"
						onChangeText={(value) =>
							setProfileData((prevData) => ({
								...prevData,
								info: { ...prevData.info, rating: Number(value) },
							}))
						}
					/>
				</View>

				{/* Social Links */}
				<View style={styles.fieldContainer}>
					<Text style={styles.label}>Social Links</Text>
					{profileData.socials.map((social, index) => (
						<View key={index} style={styles.socialRow}>
							<Picker
								selectedValue={social.platform}
								style={styles.picker}
								onValueChange={(value) =>
									updateSocial(index, "platform", value)
								}
							>
								<Picker.Item label="Facebook" value="Facebook" />
								<Picker.Item label="Instagram" value="Instagram" />
								<Picker.Item label="Twitter" value="Twitter" />
								<Picker.Item label="LinkedIn" value="LinkedIn" />
							</Picker>
							<TextInput
								style={[styles.input, styles.socialInput]}
								placeholder="URL (e.g., https://facebook.com)"
								value={social.url ?? ""}
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
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#f7f7f7",
		flex: 1,
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
