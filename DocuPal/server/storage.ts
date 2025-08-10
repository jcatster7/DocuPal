import { type PetitionForm, type FormSubmission, type UserProfile, type GeneratedDocument, type InsertPetitionForm, type InsertFormSubmission, type InsertUserProfile, type InsertGeneratedDocument } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Petition Forms
  getPetitionForms(): Promise<PetitionForm[]>;
  getPetitionForm(code: string): Promise<PetitionForm | undefined>;
  createPetitionForm(form: InsertPetitionForm): Promise<PetitionForm>;
  
  // Form Submissions
  getFormSubmission(id: string): Promise<FormSubmission | undefined>;
  getFormSubmissionsBySession(sessionId: string): Promise<FormSubmission[]>;
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  updateFormSubmission(id: string, updates: Partial<FormSubmission>): Promise<FormSubmission | undefined>;
  
  // User Profiles
  getUserProfile(sessionId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(sessionId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined>;
  
  // Generated Documents
  getGeneratedDocument(id: string): Promise<GeneratedDocument | undefined>;
  getDocumentsBySubmission(submissionId: string): Promise<GeneratedDocument[]>;
  createGeneratedDocument(document: InsertGeneratedDocument): Promise<GeneratedDocument>;
}

export class MemStorage implements IStorage {
  private petitionForms: Map<string, PetitionForm>;
  private formSubmissions: Map<string, FormSubmission>;
  private userProfiles: Map<string, UserProfile>;
  private generatedDocuments: Map<string, GeneratedDocument>;

  constructor() {
    this.petitionForms = new Map();
    this.formSubmissions = new Map();
    this.userProfiles = new Map();
    this.generatedDocuments = new Map();
    
    // Initialize with California Judicial Council forms
    this.initializePetitionForms();
  }

  private initializePetitionForms() {
    const forms: PetitionForm[] = [
      {
        id: "fl-100",
        code: "FL-100",
        name: "Petition for Dissolution, Legal Separation, or Nullity",
        category: "family",
        description: "This form is used to start a divorce, legal separation, or annulment case in California.",
        estimatedTime: "15-30 minutes" as string,
        requiredDocuments: ["ID", "Marriage Certificate"],
        fields: {
          petitioner: ["fullName", "dateOfBirth", "address", "phone", "email"],
          respondent: ["fullName", "dateOfBirth", "address"],
          case: ["marriageDate", "separationDate", "county"],
          children: ["hasMinorChildren"]
        },
        isActive: true,
        lastUpdated: new Date(),
      },
      {
        id: "fl-200",
        code: "FL-200",
        name: "Petition to Establish Parental Relationship",
        category: "family",
        description: "This form is used to establish paternity and parental rights.",
        estimatedTime: "20-35 minutes",
        requiredDocuments: ["ID", "Birth Certificate"],
        fields: {
          petitioner: ["fullName", "dateOfBirth", "address", "phone", "email"],
          respondent: ["fullName", "dateOfBirth", "address"],
          children: ["childName", "childDateOfBirth", "childGender"]
        },
        isActive: true,
        lastUpdated: new Date(),
      },
      {
        id: "de-111",
        code: "DE-111",
        name: "Petition for Probate",
        category: "probate",
        description: "This form is used to open a probate case after someone dies.",
        estimatedTime: "25-40 minutes",
        requiredDocuments: ["Death Certificate", "Will", "ID"],
        fields: {
          petitioner: ["fullName", "address", "phone", "email"],
          decedent: ["fullName", "dateOfDeath", "placeOfDeath"],
          estate: ["estimatedValue", "hasWill"]
        },
        isActive: true,
        lastUpdated: new Date(),
      },
      {
        id: "gc-210",
        code: "GC-210",
        name: "Petition for Appointment of Guardian of Minor",
        category: "probate",
        description: "This form is used to request guardianship of a minor child.",
        estimatedTime: "30-45 minutes",
        requiredDocuments: ["ID", "Child's Birth Certificate", "Parental Consent"],
        fields: {
          petitioner: ["fullName", "dateOfBirth", "address", "phone", "email"],
          child: ["fullName", "dateOfBirth", "currentAddress"],
          parents: ["motherName", "fatherName", "parentStatus"]
        },
        isActive: true,
        lastUpdated: new Date(),
      },
      {
        id: "cr-180",
        code: "CR-180",
        name: "Petition for Dismissal (Expungement)",
        category: "criminal",
        description: "This form is used to request dismissal of a criminal conviction.",
        estimatedTime: "15-25 minutes",
        requiredDocuments: ["ID", "Case Information", "Probation Records"],
        fields: {
          petitioner: ["fullName", "dateOfBirth", "address", "phone"],
          case: ["caseNumber", "convictionDate", "charges", "county"]
        },
        isActive: true,
        lastUpdated: new Date(),
      }
    ];

    forms.forEach(form => {
      this.petitionForms.set(form.code, form);
    });
  }

  // Petition Forms
  async getPetitionForms(): Promise<PetitionForm[]> {
    return Array.from(this.petitionForms.values()).filter(form => form.isActive);
  }

  async getPetitionForm(code: string): Promise<PetitionForm | undefined> {
    return this.petitionForms.get(code);
  }

  async createPetitionForm(formData: InsertPetitionForm): Promise<PetitionForm> {
    const id = randomUUID();
    const form: PetitionForm = {
      ...formData,
      id,
      isActive: true,
      lastUpdated: new Date(),
      estimatedTime: formData.estimatedTime || null,
      requiredDocuments: formData.requiredDocuments || null,
      fields: formData.fields || null,
    };
    this.petitionForms.set(form.code, form);
    return form;
  }

  // Form Submissions
  async getFormSubmission(id: string): Promise<FormSubmission | undefined> {
    return this.formSubmissions.get(id);
  }

  async getFormSubmissionsBySession(sessionId: string): Promise<FormSubmission[]> {
    return Array.from(this.formSubmissions.values()).filter(
      submission => submission.sessionId === sessionId
    );
  }

  async createFormSubmission(submissionData: InsertFormSubmission): Promise<FormSubmission> {
    const id = randomUUID();
    const submission: FormSubmission = {
      ...submissionData,
      id,
      createdAt: new Date(),
      completedAt: null,
      status: submissionData.status || "draft",
      formData: submissionData.formData || null,
      uploadedFiles: submissionData.uploadedFiles || null,
      language: submissionData.language || "en",
      county: submissionData.county || null,
    };
    this.formSubmissions.set(id, submission);
    return submission;
  }

  async updateFormSubmission(id: string, updates: Partial<FormSubmission>): Promise<FormSubmission | undefined> {
    const existing = this.formSubmissions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.formSubmissions.set(id, updated);
    return updated;
  }

  // User Profiles
  async getUserProfile(sessionId: string): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      profile => profile.sessionId === sessionId
    );
  }

  async createUserProfile(profileData: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = {
      ...profileData,
      id,
      lastUsed: new Date(),
      language: profileData.language || "en",
      profileData: profileData.profileData || null,
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(sessionId: string, updates: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const existing = Array.from(this.userProfiles.values()).find(
      profile => profile.sessionId === sessionId
    );
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates, lastUsed: new Date() };
    this.userProfiles.set(existing.id, updated);
    return updated;
  }

  // Generated Documents
  async getGeneratedDocument(id: string): Promise<GeneratedDocument | undefined> {
    return this.generatedDocuments.get(id);
  }

  async getDocumentsBySubmission(submissionId: string): Promise<GeneratedDocument[]> {
    return Array.from(this.generatedDocuments.values()).filter(
      doc => doc.submissionId === submissionId
    );
  }

  async createGeneratedDocument(documentData: InsertGeneratedDocument): Promise<GeneratedDocument> {
    const id = randomUUID();
    const document: GeneratedDocument = {
      ...documentData,
      id,
      createdAt: new Date(),
      fileData: documentData.fileData || null,
    };
    this.generatedDocuments.set(id, document);
    return document;
  }
}

export const storage = new MemStorage();
