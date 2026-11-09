import { useSignIn, useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  ThemedButtonPrimary,
  ThemedInput,
  ThemedText,
  ThemedView,
} from "../ThemedComponents";

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn() as any;
  const { isSignedIn } = useAuth(); // Check auth state
  const router = useRouter();

  const [secureText, setSecureText] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If a session already exists, automatically redirect to the app
  useEffect(() => {
    if (isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn]);

  const handleSignIn = async () => {
    if (!isLoaded) return;

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)");
      } else {
        console.log("Sign-in incomplete status:", result.status);
      }
    } catch (err: any) {
      // Handle the case gracefully if session already exists mid-click
      if (err.errors?.[0]?.code === "session_exists" || isSignedIn) {
        router.replace("/(tabs)");
        return;
      }

      const errorMessage =
        err.errors?.[0]?.longMessage ||
        err.errors?.[0]?.message ||
        "An error occurred during sign in.";

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Bottom Sheet Card */}
      <ThemedView style={styles.subContainer}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>Welcome Back</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Please sign in to continue
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
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor={"#888"}
            keyboardType={"email-address"}
            autoCapitalize={"none"}
            autoCorrect={false}
            autoComplete={"email"}
            textContentType={"emailAddress"}
            returnKeyType={"next"}
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
            autoComplete={"password"}
            textContentType={"password"}
            returnKeyType={"done"}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Ionicons
              name={secureText ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#575656"
            />
          </TouchableOpacity>
        </ThemedView>

        <ThemedButtonPrimary
          style={styles.btn}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.btnText}>Login</ThemedText>
          )}
        </ThemedButtonPrimary>

        <TouchableOpacity
          style={styles.footerContainer}
          onPress={() => router.replace("/(auth)/signUp")}
        >
          <ThemedText>
            Don't have an account?{" "}
            <ThemedText style={styles.secTextBold}>Sign up</ThemedText>
          </ThemedText>
        </TouchableOpacity>
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
  subContainer: {
    width: "100%",
    height: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 36,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    width: "100%",
    marginBottom: 24,
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
    marginBottom: 20,
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
    marginTop: 24,
  },
  secTextBold: {
    fontWeight: "600",
    color: "#0588d3",
  },
});
