import type { PetitionForm } from "@shared/schema";

// Mock forms data that matches the backend schema
export const MOCK_FORMS: PetitionForm[] = [
  {
    id: "fl-100",
    code: "FL-100",
    name: "Petition for Dissolution, Legal Separation, or Nullity",
    category: "family",
    description: "This form is used to start a divorce, legal separation, or annulment case in California.",
    estimatedTime: "15-30 minutes",
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
    category: "civil",
    description: "This form is used to request dismissal of a criminal conviction.",
    estimatedTime: "15-25 minutes",
    requiredDocuments: ["ID", "Case Information", "Probation Records"],
    fields: {
      petitioner: ["fullName", "dateOfBirth", "address", "phone"],
      case: ["caseNumber", "convictionDate", "charges", "county"]
    },
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "sc-100",
    code: "SC-100",
    name: "Plaintiff's Claim and Order to Go to Small Claims Court",
    category: "civil",
    description: "This form is used to file a small claims case for amounts up to $10,000.",
    estimatedTime: "10-20 minutes",
    requiredDocuments: ["ID", "Supporting Documents", "Proof of Service"],
    fields: {
      plaintiff: ["fullName", "address", "phone", "email"],
      defendant: ["fullName", "address"],
      claim: ["amount", "reason", "supportingEvidence"]
    },
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "mc-410",
    code: "MC-410",
    name: "Motion to Change or Set Aside Judgment",
    category: "civil",
    description: "This form is used to request a change to a court judgment.",
    estimatedTime: "20-30 minutes",
    requiredDocuments: ["ID", "Original Judgment", "Supporting Evidence"],
    fields: {
      movant: ["fullName", "address", "phone", "email"],
      case: ["caseNumber", "judgmentDate", "requestedChange"],
      grounds: ["legalBasis", "supportingEvidence"]
    },
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: "adopt-200",
    code: "ADOPT-200",
    name: "Adoption Request",
    category: "family",
    description: "This form is used to request adoption of a child.",
    estimatedTime: "45-60 minutes",
    requiredDocuments: ["ID", "Child's Birth Certificate", "Home Study Report"],
    fields: {
      petitioner: ["fullName", "dateOfBirth", "address", "phone", "email"],
      child: ["fullName", "dateOfBirth", "currentAddress"],
      biological: ["motherName", "fatherName", "consentStatus"]
    },
    isActive: true,
    lastUpdated: new Date(),
  }
];
