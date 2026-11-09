import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// 1. User Profiles & Preferences Table (Linked to Clerk via clerkId)
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(), // Comes from Clerk (e.g., user_2n...)
  email: text("email").notNull(),
  fullName: text("full_name"),
  targetRole: text("target_role").notNull(), // e.g. "Mobile Architect"
  seniorityLevel: text("seniority_level").notNull(), // 'entry' | 'mid' | 'senior' | 'lead'
  preferredMode: text("preferred_mode").default("voice").notNull(), // 'voice' | 'text'
  aiRigor: text("ai_rigor").default("standard").notNull(), // 'standard' | 'pro' | 'adaptive'
  practiceReminders: boolean("practice_reminders").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Resumes Table
export const resumes = pgTable("resumes", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull(),
  fileUrl: text("file_url").notNull(), // Storage link (S3 / R2)
  fileName: text("file_name").notNull(),
  rawText: text("raw_text"), // Extracted raw text from document
  parsedSkills: jsonb("parsed_skills"), // e.g. ["React Native", "TypeScript", "C# .NET"]
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Interviews Table
export const interviews = pgTable("interviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull(),
  targetRole: text("target_role").notNull(),
  difficulty: text("difficulty").notNull(),
  mode: text("mode").notNull(),
  status: text("status").default("in_progress").notNull(),
  overallScore: integer("overall_score"),
  finalReport: jsonb("final_report"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// 4. Interview Turns Table (Stores turn-by-turn question/answer analysis)
export const interviewTurns = pgTable("interview_turns", {
  id: uuid("id").primaryKey().defaultRandom(),
  interviewId: uuid("interview_id")
    .references(() => interviews.id, { onDelete: "cascade" })
    .notNull(),
  turnNumber: integer("turn_number").notNull(),
  questionText: text("question_text").notNull(),
  questionAudioUrl: text("question_audio_url"),
  userAnswerText: text("user_answer_text"),
  userAnswerAudioUrl: text("user_answer_audio_url"),
  turnAnalysis: jsonb("turn_analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Job Applications Table (Kanban Board Support)
export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull(),
  companyName: text("company_name").notNull(),
  jobTitle: text("job_title").notNull(),
  status: text("status").default("wishlist").notNull(), // 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'archived'
  atsMatchScore: integer("ats_match_score"),
  jobDescription: text("job_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//RELATIONSHIPS
export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  resumes: many(resumes),
  interviews: many(interviews),
  jobApplications: many(jobApplications),
}));

export const resumesRelations = relations(resumes, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [resumes.clerkId],
    references: [userProfiles.clerkId],
  }),
}));

export const interviewsRelations = relations(interviews, ({ one, many }) => ({
  userProfile: one(userProfiles, {
    fields: [interviews.clerkId],
    references: [userProfiles.clerkId],
  }),
  turns: many(interviewTurns),
}));

export const interviewTurnsRelations = relations(interviewTurns, ({ one }) => ({
  interview: one(interviews, {
    fields: [interviewTurns.interviewId],
    references: [interviews.id],
  }),
}));

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    userProfile: one(userProfiles, {
      fields: [jobApplications.clerkId],
      references: [userProfiles.clerkId],
    }),
  }),
);
