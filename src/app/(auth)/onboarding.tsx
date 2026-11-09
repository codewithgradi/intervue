// src/app/(auth)/onboarding.tsx
import { Ionicons } from "@expo/vector-icons";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Mic,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";

import {
  ThemedButtonPrimary,
  ThemedText,
  ThemedView,
} from "@/components/ThemedComponents";

// Import your direct database handler function
import { handleSaveUserProfile } from "@/api/onboarding";

interface OnboardingData {
  fullName: string;
  targetRole: string;
  seniorityLevel: "entry" | "mid" | "senior" | "lead";
  deliveryMode: "voice" | "text";
  aiRigor: "standard" | "pro" | "adaptive";
  practiceReminders: boolean;
}

const SENIORITY_OPTIONS = [
  { id: "entry", label: "Entry Level", desc: "0-2 yrs • Foundations & Syntax" },
  { id: "mid", label: "Mid Level", desc: "2-5 yrs • Practical Architecture" },
  { id: "senior", label: "Senior", desc: "5-8 yrs • Deep System Design" },
  { id: "lead", label: "Staff / Lead", desc: "8+ yrs • Leadership & Vision" },
] as const;

const RIGOR_OPTIONS = [
  {
    id: "standard",
    label: "Standard",
    badge: "Balanced",
    icon: Target,
    desc: "Friendly conversational interviewer focusing on core principles.",
  },
  {
    id: "pro",
    label: "Professional",
    badge: "Strict",
    icon: ShieldAlert,
    desc: "Challenging follow-ups, edge cases, and performance constraints.",
  },
  {
    id: "adaptive",
    label: "Adaptive AI",
    badge: "Dynamic",
    icon: Sparkles,
    desc: "Dynamically ramps up difficulty based on your accuracy.",
  },
] as const;

export default function OnboardingScreen() {
  const { userId } = useAuth(); // Clerk ID string (e.g. user_2n...)
  const { user } = useUser(); // Clerk user profile info
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    fullName: user?.fullName || "",
    targetRole: "Mobile Architect",
    seniorityLevel: "senior",
    deliveryMode: "voice",
    aiRigor: "pro",
    practiceReminders: true,
  });

  const handleCompleteOnboarding = async () => {
    if (!userId) {
      Alert.alert("Error", "No authenticated Clerk session found.");
      return;
    }

    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    if (!primaryEmail) {
      Alert.alert("Error", "No primary email found.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Payload mapped directly to handleSaveUserProfile parameters
      await handleSaveUserProfile({
        clerkId: userId,
        email: primaryEmail,
        fullName: formData.fullName || user?.fullName || "",
        targetRole: formData.targetRole,
        seniorityLevel: formData.seniorityLevel,
        preferredMode: formData.deliveryMode,
        aiRigor: formData.aiRigor,
        practiceReminders: formData.practiceReminders,
      });

      // Route to main application app group
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save profile setup.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    if (step < 2) {
      setStep((prev) => (prev + 1) as 1 | 2);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Branding Header */}
      <ThemedView style={styles.heroSection}>
        <ThemedText style={styles.heroTitle}>Intervue</ThemedText>
        <ThemedText style={styles.heroSubtitle}>
          Setup Profile (Step {step} of 2)
        </ThemedText>

        <View style={styles.progressBarTrack}>
          <View
            style={[styles.progressBarFill, { width: `${(step / 2) * 100}%` }]}
          />
        </View>
      </ThemedView>

      {/* Bottom Sheet Card */}
      <ThemedView style={styles.subContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.containerBackButton}
            onPress={handlePrevStep}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color="#0F172A" />
            <ThemedText style={styles.backButtonText}>Back</ThemedText>
          </TouchableOpacity>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.header}>
                <ThemedText style={styles.headerTitle}>
                  Basic Details
                </ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                  Tell us who you are and your target role
                </ThemedText>
              </View>

              <ThemedText style={styles.label}>Full Name</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#94A3B8"
                  value={formData.fullName}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, fullName: text }))
                  }
                />
              </View>

              <ThemedText style={styles.label}>Target Role</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Mobile Architect"
                  placeholderTextColor="#94A3B8"
                  value={formData.targetRole}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, targetRole: text }))
                  }
                />
              </View>

              <ThemedText style={styles.label}>Seniority Level</ThemedText>
              <View style={styles.seniorityGrid}>
                {SENIORITY_OPTIONS.map((lvl) => {
                  const isSelected = formData.seniorityLevel === lvl.id;
                  return (
                    <TouchableOpacity
                      key={lvl.id}
                      style={[
                        styles.seniorityCard,
                        isSelected && styles.seniorityCardActive,
                      ]}
                      onPress={() =>
                        setFormData((prev) => ({
                          ...prev,
                          seniorityLevel: lvl.id,
                        }))
                      }
                      activeOpacity={0.7}
                    >
                      <ThemedText
                        style={[
                          styles.seniorityTitle,
                          isSelected && styles.seniorityTitleActive,
                        ]}
                      >
                        {lvl.label}
                      </ThemedText>
                      <ThemedText
                        style={[
                          styles.seniorityDesc,
                          isSelected && styles.seniorityDescActive,
                        ]}
                      >
                        {lvl.desc}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 2: Preferences & Professional AI Rigor */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.header}>
                <ThemedText style={styles.headerTitle}>
                  Finalize Session
                </ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                  Configure your environment settings
                </ThemedText>
              </View>

              <ThemedText style={styles.label}>Delivery Mode</ThemedText>
              <View style={styles.modeRow}>
                <TouchableOpacity
                  style={[
                    styles.modeCard,
                    formData.deliveryMode === "voice" && styles.modeCardActive,
                  ]}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, deliveryMode: "voice" }))
                  }
                  activeOpacity={0.8}
                >
                  <Mic
                    size={18}
                    color={
                      formData.deliveryMode === "voice" ? "#ffffff" : "#0588d3"
                    }
                  />
                  <ThemedText
                    style={[
                      styles.modeText,
                      formData.deliveryMode === "voice" &&
                        styles.modeTextActive,
                    ]}
                  >
                    Voice (Audio)
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modeCard,
                    formData.deliveryMode === "text" && styles.modeCardActive,
                  ]}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, deliveryMode: "text" }))
                  }
                  activeOpacity={0.8}
                >
                  <MessageSquare
                    size={18}
                    color={
                      formData.deliveryMode === "text" ? "#ffffff" : "#0588d3"
                    }
                  />
                  <ThemedText
                    style={[
                      styles.modeText,
                      formData.deliveryMode === "text" && styles.modeTextActive,
                    ]}
                  >
                    Text Chat
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <ThemedText style={styles.label}>
                AI Rigor & Interviewer Persona
              </ThemedText>
              <View style={styles.rigorContainer}>
                {RIGOR_OPTIONS.map((rigor) => {
                  const IconComponent = rigor.icon;
                  const isSelected = formData.aiRigor === rigor.id;
                  return (
                    <TouchableOpacity
                      key={rigor.id}
                      style={[
                        styles.rigorCard,
                        isSelected && styles.rigorCardActive,
                      ]}
                      onPress={() =>
                        setFormData((prev) => ({ ...prev, aiRigor: rigor.id }))
                      }
                      activeOpacity={0.8}
                    >
                      <View style={styles.rigorHeader}>
                        <View style={styles.rigorTitleRow}>
                          <IconComponent
                            size={18}
                            color={isSelected ? "#0588d3" : "#64748B"}
                          />
                          <ThemedText
                            style={[
                              styles.rigorLabel,
                              isSelected && styles.rigorLabelActive,
                            ]}
                          >
                            {rigor.label}
                          </ThemedText>
                        </View>
                        <View
                          style={[
                            styles.badge,
                            isSelected && styles.badgeActive,
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.badgeText,
                              isSelected && styles.badgeTextActive,
                            ]}
                          >
                            {rigor.badge}
                          </ThemedText>
                        </View>
                      </View>
                      <ThemedText style={styles.rigorDesc}>
                        {rigor.desc}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>
                  Practice Reminders
                </ThemedText>
                <Switch
                  value={formData.practiceReminders}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, practiceReminders: val }))
                  }
                  trackColor={{ false: "#E2E8F0", true: "#BAE6FD" }}
                  thumbColor={
                    formData.practiceReminders ? "#0588d3" : "#F8FAFC"
                  }
                />
              </View>
            </View>
          )}

          {/* Bottom Controls */}
          <View style={styles.footerRow}>
            {step < 2 ? (
              <ThemedButtonPrimary
                style={[styles.primaryButton, { flex: 1 }]}
                onPress={handleNextStep}
              >
                <ThemedText style={styles.primaryButtonText}>
                  Continue
                </ThemedText>
                <ChevronRight size={18} color="#ffffff" />
              </ThemedButtonPrimary>
            ) : (
              <ThemedButtonPrimary
                style={[styles.primaryButton, { flex: 1 }]}
                onPress={handleCompleteOnboarding}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <ThemedText style={styles.primaryButtonText}>
                    Launch Session
                  </ThemedText>
                )}
              </ThemedButtonPrimary>
            )}
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0588d3",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  heroSection: {
    position: "absolute",
    top: "7%",
    alignItems: "center",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 32,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 2,
    fontWeight: "400",
  },
  progressBarTrack: {
    width: "80%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 2,
    marginTop: 14,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 2,
  },
  subContainer: {
    width: "100%",
    height: "82%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  containerBackButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 4,
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginLeft: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  stepContainer: {
    width: "100%",
  },
  header: {
    width: "100%",
    marginBottom: 18,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 3,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginTop: 14,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderBottomWidth: 1.5,
    borderBottomColor: "#F1F5F9",
    marginBottom: 8,
    paddingBottom: 4,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "transparent",
  },
  seniorityGrid: {
    flexDirection: "column",
    gap: 8,
    marginTop: 4,
  },
  seniorityCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  seniorityCardActive: {
    backgroundColor: "#F0F9FF",
    borderColor: "#0588d3",
  },
  seniorityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  seniorityTitleActive: {
    color: "#0588d3",
  },
  seniorityDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  seniorityDescActive: {
    color: "#0284C7",
  },
  modeRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  modeCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  modeCardActive: {
    backgroundColor: "#0588d3",
    borderColor: "#0588d3",
  },
  modeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0588d3",
  },
  modeTextActive: {
    color: "#ffffff",
  },
  rigorContainer: {
    flexDirection: "column",
    gap: 10,
    marginTop: 4,
  },
  rigorCard: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  rigorCardActive: {
    backgroundColor: "#F0F9FF",
    borderColor: "#0588d3",
  },
  rigorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  rigorTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rigorLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  rigorLabelActive: {
    color: "#0588d3",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  badgeActive: {
    backgroundColor: "#BAE6FD",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  badgeTextActive: {
    color: "#0284C7",
  },
  rigorDesc: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  footerRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
