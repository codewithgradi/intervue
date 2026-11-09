import React, { useState } from "react";
import { Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import { useAuth, useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Your custom components
import {
  ThemedView,
  ThemedButtonPrimary,
  ThemedText,
  ThemedInput,
} from "@/components/ThemedComponents";
import { StyleSheet } from "react-native";

export default function SignUpPage() {
  const { isLoaded } = useAuth();
  const { signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded || !signUp) return;

    if (!emailAddress || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp.password({ emailAddress, password });
      if (error) {
        Alert.alert(
          "Sign Up Error",
          error.message || "Failed to create account.",
        );
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) {
        Alert.alert(
          "Verification Error",
          sendError.message || "Could not send verification code.",
        );
        return;
      }

      setIsVerifying(true);
    } catch (err: any) {
      Alert.alert("Error", err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Official Clerk Verification Handler
  const handleVerify = async () => {
    if (!isLoaded || !signUp) return;

    if (!code) {
      Alert.alert("Error", "Please enter the verification code.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        Alert.alert(
          "Invalid Code",
          error.message || "Verification code is incorrect.",
        );
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        Alert.alert(
          "Finalize Error",
          finalizeError.message || "Could not complete registration.",
        );
        return;
      }

      // Once finalized successfully, your RootLayout useAuth listener auto-routes the user!
    } catch (err: any) {
      Alert.alert("Error", err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return null;
  }

  // Verification Screen View
  if (isVerifying) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.subContainer}>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.headerTitle}>Verify Email</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Enter the verification code sent to {emailAddress}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <Ionicons
              name="key-outline"
              size={20}
              color="#575656"
              style={styles.icon}
            />
            <ThemedInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="Enter verification code"
              placeholderTextColor={"#888"}
              keyboardType="numeric"
              autoFocus
            />
          </ThemedView>

          <ThemedButtonPrimary
            style={styles.btn}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.btnText}>Verify</ThemedText>
            )}
          </ThemedButtonPrimary>
        </ThemedView>
      </ThemedView>
    );
  }

  // Initial Sign Up View
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.subContainer}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>Create Account</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Sign up to get started
          </ThemedText>
        </ThemedView>

        {/* Email Input */}
        <ThemedView style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#575656"
            style={styles.icon}
          />
          <ThemedInput
            style={styles.input}
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="Email address"
            placeholderTextColor={"#888"}
            keyboardType={"email-address"}
            autoCapitalize={"none"}
            autoCorrect={false}
          />
        </ThemedView>

        {/* Password Input */}
        <ThemedView style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color="#575656"
            style={styles.icon}
          />
          <ThemedInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={"#888"}
            secureTextEntry={secureText}
            autoCapitalize={"none"}
            autoCorrect={false}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Ionicons
              name={secureText ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#575656"
            />
          </TouchableOpacity>
        </ThemedView>

        {/* Confirm Password Input */}
        <ThemedView style={styles.inputContainer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color="#575656"
            style={styles.icon}
          />
          <ThemedInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            placeholderTextColor={"#888"}
            secureTextEntry={secureConfirmText}
            autoCapitalize={"none"}
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => setSecureConfirmText(!secureConfirmText)}
          >
            <Ionicons
              name={secureConfirmText ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#575656"
            />
          </TouchableOpacity>
        </ThemedView>

        {/* Submit Button */}
        <ThemedButtonPrimary
          style={styles.btn}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.btnText}>Sign Up</ThemedText>
          )}
        </ThemedButtonPrimary>

        <TouchableOpacity
          style={styles.footerContainer}
          onPress={() => router.replace("/(auth)/login")}
        >
          <ThemedText>
            Already have an account?{" "}
            <ThemedText style={styles.secTextBold}>Log in</ThemedText>
          </ThemedText>
        </TouchableOpacity>

        {/* Required for legacy bot protection on web */}
        <ThemedView nativeID="clerk-captcha" />
      </ThemedView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0588d3",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  img: {
    width: 100,
    height: 100,
    position: "absolute",
    top: -18,
  },
  heroSection: {
    position: "absolute",
    top: "8%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  subContainer: {
    width: "100%",
    height: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    marginBottom: 18,
    paddingBottom: 4,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "transparent",
    fontSize: 16,
  },
  btn: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  footerContainer: {
    marginTop: 20,
  },
  secTextBold: {
    fontWeight: "600",
    color: "#0588d3",
  },
});
