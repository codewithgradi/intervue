import Ionicons from "@expo/vector-icons/Ionicons";
import { Dimensions, Image, StyleSheet } from "react-native";
import {
  ThemedButtonPrimary,
  ThemedButtonSecondary,
  ThemedText,
  ThemedView,
} from "../ThemedComponents";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function HomePage() {
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      {/* Hero AI Bot Image & Floating Icon */}
      <ThemedView style={styles.imageContainer}>
        <ThemedView style={styles.iconWrapper}>
          <Image
            source={require("../../../assets/images/app/home.png")}
            style={styles.img}
            resizeMode="contain"
          />
          <Ionicons
            name="chatbubble-ellipses"
            size={90}
            color="#21a3fa"
            style={styles.floatingIcon}
          />
        </ThemedView>
      </ThemedView>

      {/* Body Copy */}
      <ThemedView style={styles.body}>
        <ThemedText style={styles.title}>Intervue AI</ThemedText>
        <ThemedText style={styles.subTitle}>
          Master your technical interviews with Real-Time AI.
        </ThemedText>
      </ThemedView>

      {/* Actions */}
      <ThemedView style={styles.actionContainer}>
        <ThemedButtonPrimary
          style={styles.primaryBtn}
          onPress={() => router.push("/(auth)/signUp")}
        >
          <ThemedText style={styles.primaryBtnText}>Get Started</ThemedText>
        </ThemedButtonPrimary>

        <ThemedButtonSecondary
          style={styles.secondaryBtn}
          onPress={() => router.push("/(auth)/login")}
        >
          <ThemedText style={styles.secondaryBtnText}>
            Already have an account?{" "}
            <ThemedText style={styles.linkText}>Log in</ThemedText>
          </ThemedText>
        </ThemedButtonSecondary>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  iconWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(33, 163, 250, 0.08)",
    position: "relative",
    marginTop: 150,
  },
  img: {
    width: 200,
    height: 280,
  },
  floatingIcon: {
    position: "absolute",
    top: -50,
    right: -55,
  },
  body: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subTitle: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 16,
    opacity: 0.6,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  actionContainer: {
    width: "100%",
    gap: 12,
  },
  primaryBtn: {
    width: "100%",
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryBtn: {
    width: "100%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontSize: 14,
    opacity: 0.7,
  },
  linkText: {
    fontWeight: "600",
    color: "#21a3fa",
    opacity: 1,
  },
});
