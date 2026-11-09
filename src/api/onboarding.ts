import { db } from "@/db";
import { userProfiles } from "@/db/schema";

interface ProfilePayload {
  clerkId: string;
  email: string;
  fullName: string;
  targetRole: string;
  seniorityLevel: "entry" | "mid" | "senior" | "lead";
  preferredMode: "voice" | "text";
  aiRigor: "standard" | "pro" | "adaptive";
  practiceReminders: boolean;
}

export async function handleSaveUserProfile(payload: ProfilePayload) {
  // Upsert user profile directly in Neon via Drizzle (no CV/resume processing)
  const updatedProfile = await db
    .insert(userProfiles)
    .values({
      clerkId: payload.clerkId,
      email: payload.email,
      fullName: payload.fullName,
      targetRole: payload.targetRole,
      seniorityLevel: payload.seniorityLevel,
      preferredMode: payload.preferredMode,
      aiRigor: payload.aiRigor,
      practiceReminders: payload.practiceReminders,
    })
    .onConflictDoUpdate({
      target: userProfiles.clerkId,
      set: {
        fullName: payload.fullName,
        targetRole: payload.targetRole,
        seniorityLevel: payload.seniorityLevel,
        preferredMode: payload.preferredMode,
        aiRigor: payload.aiRigor,
        practiceReminders: payload.practiceReminders,
        updatedAt: new Date(),
      },
    })
    .returning();

  return { success: true, profile: updatedProfile[0] };
}
