import type { PetitionForm } from "@shared/schema";

export const PETITION_CATEGORIES = {
  family: "Family Law",
  probate: "Probate", 
  civil: "Civil",
  criminal: "Criminal"
} as const;

export const CALIFORNIA_COUNTIES = [
  "Los Angeles", "San Francisco", "Orange", "San Diego", "Riverside", "Sacramento",
  "Alameda", "Santa Clara", "San Bernardino", "Contra Costa", "Fresno", "Kern",
  "Ventura", "San Mateo", "Sonoma", "Stanislaus", "San Joaquin", "Santa Barbara",
  "Solano", "Monterey", "Placer", "San Luis Obispo", "Santa Cruz", "Merced",
  "Butte", "Yolo", "El Dorado", "Imperial", "Shasta", "Kings", "Madera", "Napa",
  "Tulare", "Nevada", "Humboldt", "Lake", "Mendocino", "Sutter", "Yuba", 
  "Amador", "Calaveras", "Colusa", "Del Norte", "Glenn", "Inyo", "Lassen",
  "Mariposa", "Mono", "Plumas", "San Benito", "Sierra", "Siskiyou", "Tehama",
  "Trinity", "Tuolumne"
];

export const DOCUMENT_CATEGORIES = [
  {
    id: "identity",
    name: "Identity Documents",
    icon: "fas fa-id-card",
    items: ["Driver's License or State ID", "Social Security Card", "Passport"],
    color: "legal-blue"
  },
  {
    id: "legal", 
    name: "Legal Documents",
    icon: "fas fa-certificate",
    items: ["Marriage Certificate", "Birth Certificates", "Previous Court Orders"],
    color: "legal-green"
  },
  {
    id: "financial",
    name: "Financial Documents", 
    icon: "fas fa-dollar-sign",
    items: ["Pay Stubs", "Tax Returns", "Bank Statements"],
    color: "legal-purple"
  },
  {
    id: "property",
    name: "Property Documents",
    icon: "fas fa-home", 
    items: ["Property Deeds", "Lease Agreements", "Vehicle Registrations"],
    color: "legal-red"
  }
];

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function getFormDisplayName(form: PetitionForm): string {
  return `${form.code} - ${form.name}`;
}

export function getCategoryDisplayName(category: string): string {
  return PETITION_CATEGORIES[category as keyof typeof PETITION_CATEGORIES] || category;
}

export function validateFormData(formData: Record<string, any>, selectedForm: PetitionForm): string[] {
  const errors: string[] = [];
  
  if (!formData.petitioner?.fullName) {
    errors.push("Petitioner full name is required");
  }
  
  if (selectedForm.category === "family") {
    if (!formData.respondent?.fullName) {
      errors.push("Respondent full name is required");
    }
    if (!formData.case?.county) {
      errors.push("County of filing is required");
    }
  }
  
  return errors;
}

export function getRequiredDocuments(formCode: string): string[] {
  const documentMap: Record<string, string[]> = {
    "FL-100": ["ID", "Marriage Certificate"],
    "FL-200": ["ID", "Birth Certificate"],
    "DE-111": ["Death Certificate", "Will", "ID"],
    "GC-210": ["ID", "Child's Birth Certificate", "Parental Consent"],
    "CR-180": ["ID", "Case Information", "Probation Records"]
  };
  
  return documentMap[formCode] || ["ID"];
}
