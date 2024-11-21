import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton"; // Importing the custom button
import { Ionicons } from "@expo/vector-icons"; // For the eye icon
import { register } from "../../api/auth";

export default function RegisterBuyer() {
	const [registerData, setRegisterData] = useState({
		first_name: "",
		last_name: "",
		email: "example@example.com",
		password: "",
		phone: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	const handleRegister = async () => {
		console.log("Register as Buyer");
		const data = {
			first_name: registerData.first_name,
			last_name: registerData.last_name,
			email: registerData.email,
			password: registerData.password,
			phone: registerData.phone,
      role: "Buyer"
		};
		await register(data);
		router.push("/(auth)/login"); // Navigate back to login after successful registration
	};
	const handleInputChange = (field, value) => {
		setRegisterData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Register as a Buyer</Text>
			<TextInput
				style={styles.input}
				placeholder="First Name"
				value={registerData.first_name}
				onChangeText={(value) => handleInputChange("first_name", value)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Last Name"
				value={registerData.last_name}
				onChangeText={(value) => handleInputChange("last_name", value)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Email"
				value={registerData.email}
				onChangeText={(value) => handleInputChange("email", value)}
			/>
			<TextInput
				style={styles.input}
				placeholder="Phone"
				value={registerData.phone}
				onChangeText={(value) => handleInputChange("phone", value)}
			/>
			<View style={styles.passwordContainer}>
				<TextInput
					style={styles.passwordInput}
					placeholder="Password"
					secureTextEntry={!showPassword}
					value={registerData.password}
					onChangeText={(value) => handleInputChange("password", value)}
				/>
				<TouchableOpacity
					onPress={togglePasswordVisibility}
					style={styles.eyeButton}
				>
					<Ionicons
						name={showPassword ? "eye" : "eye-off"}
						size={20}
						color="#999"
					/>
				</TouchableOpacity>
			</View>
			<CustomButton title="Register" onPress={handleRegister} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		backgroundColor: "#f7f7f7",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	input: {
		height: 50,
		borderColor: "#ccc",
		borderWidth: 1,
		marginBottom: 16,
		paddingHorizontal: 10,
		borderRadius: 8,
		backgroundColor: "#fff",
	},
	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 8,
		backgroundColor: "#fff",
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
});
