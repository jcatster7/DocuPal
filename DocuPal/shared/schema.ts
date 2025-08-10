import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Petition Forms Schema
export const petitionForms = pgTable("petition_forms", {
  id: varchar("id").primaryKey(),
  code: text("code").notNull().unique(), // FL-100, DE-111, etc.
  name: text("name").notNull(),
  category: text("category").notNull(), // family, probate, civil, criminal
  description: text("description").notNull(),
  estimatedTime: text("estimated_time"),
  requiredDocuments: text("required_documents").array(),
  fields: jsonb("fields").$type<Record<string, any>>(), // Dynamic form fields
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").default(sql`now()`),
});

// Form Submissions Schema
export const formSubmissions = pgTable("form_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  formCode: text("form_code").notNull(),
  sessionId: text("session_id").notNull(), // For anonymous tracking
  formData: jsonb("form_data").$type<Record<string, any>>(),
  uploadedFiles: jsonb("uploaded_files").$type<Array<{
    name: string;
    size: number;
    category: string;
    extractedText?: string;
  }>>(),
  status: text("status").default("draft"), // draft, completed, downloaded
  language: text("language").default("en"),
  county: text("county"),
  createdAt: timestamp("created_at").default(sql`now()`),
  completedAt: timestamp("completed_at"),
});

// User Profiles Schema (Anonymous, stored locally)
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(),
  profileData: jsonb("profile_data").$type<{
    petitioner?: {
      fullName?: string;
      dateOfBirth?: string;
      address?: string;
      phone?: string;
      email?: string;
    };
    respondent?: {
      fullName?: string;
      dateOfBirth?: string;
      address?: string;
    };
    children?: Array<{
      name: string;
      dateOfBirth: string;
      gender: string;
    }>;
  }>(),
  language: text("language").default("en"),
  lastUsed: timestamp("last_used").default(sql`now()`),
});

// Generated Documents Schema
export const generatedDocuments = pgTable("generated_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submissionId: text("submission_id").notNull(),
  documentType: text("document_type").notNull(), // petition, proof_of_service, exhibits
  filename: text("filename").notNull(),
  fileData: text("file_data"), // Base64 encoded PDF
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Schema exports
export const insertPetitionFormSchema = createInsertSchema(petitionForms).omit({
  id: true,
  isActive: true,
  lastUpdated: true,
});

export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  lastUsed: true,
});

export const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type PetitionForm = typeof petitionForms.$inferSelect;
export type InsertPetitionForm = z.infer<typeof insertPetitionFormSchema>;
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;
export type InsertGeneratedDocument = z.infer<typeof insertGeneratedDocumentSchema>;
