import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFormSubmissionSchema, insertUserProfileSchema, insertGeneratedDocumentSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all petition forms
  app.get("/api/petition-forms", async (req, res) => {
    try {
      const forms = await storage.getPetitionForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch petition forms" });
    }
  });

  // Get specific petition form
  app.get("/api/petition-forms/:code", async (req, res) => {
    try {
      const form = await storage.getPetitionForm(req.params.code);
      if (!form) {
        return res.status(404).json({ error: "Form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch form" });
    }
  });

  // Create form submission
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertFormSubmissionSchema.parse(req.body);
      const submission = await storage.createFormSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid form data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create submission" });
    }
  });

  // Update form submission
  app.patch("/api/submissions/:id", async (req, res) => {
    try {
      const updates = req.body;
      const submission = await storage.updateFormSubmission(req.params.id, updates);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to update submission" });
    }
  });

  // Get form submissions by session
  app.get("/api/submissions/session/:sessionId", async (req, res) => {
    try {
      const submissions = await storage.getFormSubmissionsBySession(req.params.sessionId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // Upload documents
  app.post("/api/uploads", upload.array("documents", 10), async (req, res) => {
    try {
      const files = req.files as any[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const processedFiles = files.map(file => ({
        name: file.originalname,
        size: file.size,
        category: req.body.category || "general",
        mimeType: file.mimetype,
        buffer: file.buffer.toString("base64"),
        extractedText: "", // OCR processing would happen here
      }));

      // In a real implementation, you would:
      // 1. Store files securely
      // 2. Process with OCR (Tesseract, Google Vision API, etc.)
      // 3. Extract relevant data for form filling

      res.json({ files: processedFiles });
    } catch (error) {
      res.status(500).json({ error: "Failed to process uploads" });
    }
  });

  // OCR text extraction
  app.post("/api/ocr", async (req, res) => {
    try {
      const { fileData, mimeType } = req.body;
      
      // Mock OCR processing - in production, integrate with:
      // - Tesseract.js for client-side OCR
      // - Google Vision API
      // - AWS Textract
      // - Azure Cognitive Services
      
      const extractedText = `Extracted text from ${mimeType} file`;
      const extractedData = {
        names: ["John Smith", "Jane Smith"],
        dates: ["03/15/1985", "06/15/2010"],
        addresses: ["123 Main Street, Los Angeles, CA 90210"],
        phones: ["(555) 123-4567"],
        emails: ["john@example.com"]
      };

      res.json({ text: extractedText, data: extractedData });
    } catch (error) {
      res.status(500).json({ error: "Failed to process OCR" });
    }
  });

  // Generate PDF documents
  app.post("/api/generate-documents", async (req, res) => {
    try {
      const { submissionId, formCode, formData } = req.body;
      
      // In a real implementation, this would:
      // 1. Load the appropriate PDF template
      // 2. Fill form fields with user data
      // 3. Generate additional documents (POS, exhibits)
      // 4. Return download URLs or base64 data
      
      const documents = [
        {
          type: "petition",
          filename: `${formCode}-filled.pdf`,
          size: "2.1 MB",
          downloadUrl: `/api/documents/${submissionId}/petition`
        },
        {
          type: "proof_of_service", 
          filename: "POS-040-proof-of-service.pdf",
          size: "1.3 MB",
          downloadUrl: `/api/documents/${submissionId}/pos`
        },
        {
          type: "exhibits",
          filename: "exhibits-index.pdf", 
          size: "0.8 MB",
          downloadUrl: `/api/documents/${submissionId}/exhibits`
        }
      ];

      // Store generated documents
      for (const doc of documents) {
        await storage.createGeneratedDocument({
          submissionId,
          documentType: doc.type,
          filename: doc.filename,
          fileData: "base64_encoded_pdf_data_here"
        });
      }

      res.json({ documents });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate documents" });
    }
  });

  // Download generated document
  app.get("/api/documents/:submissionId/:type", async (req, res) => {
    try {
      const { submissionId, type } = req.params;
      const documents = await storage.getDocumentsBySubmission(submissionId);
      const document = documents.find(doc => doc.documentType === type);
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      // In production, serve actual PDF data
      const pdfBuffer = Buffer.from(document.fileData || "", "base64");
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${document.filename}"`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ error: "Failed to download document" });
    }
  });

  // User profile management
  app.get("/api/profile/:sessionId", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.sessionId);
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid profile data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  app.patch("/api/profile/:sessionId", async (req, res) => {
    try {
      const profile = await storage.updateUserProfile(req.params.sessionId, req.body);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
