export interface OCRResult {
  text: string;
  confidence?: number;
  extractedData: {
    names?: string[];
    dates?: string[];
    addresses?: string[];
    phones?: string[];
    emails?: string[];
    socialSecurityNumbers?: string[];
    caseNumbers?: string[];
  };
}

export interface ProcessedFile {
  name: string;
  size: number;
  category: string;
  mimeType: string;
  ocrResult?: OCRResult;
  extractedText?: string;
}

export class OCRProcessor {
  private readonly apiEndpoint = '/api/ocr';

  /**
   * Process uploaded files for OCR text extraction
   */
  async processFiles(files: FileList): Promise<ProcessedFile[]> {
    const processedFiles: ProcessedFile[] = [];

    for (const file of Array.from(files)) {
      try {
        const processed = await this.processFile(file);
        processedFiles.push(processed);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        // Still add the file without OCR data
        processedFiles.push({
          name: file.name,
          size: file.size,
          category: this.inferCategory(file.name),
          mimeType: file.type,
        });
      }
    }

    return processedFiles;
  }

  /**
   * Process a single file for OCR extraction
   */
  async processFile(file: File): Promise<ProcessedFile> {
    // Convert file to base64 for processing
    const base64Data = await this.fileToBase64(file);
    
    // For client-side OCR, we could use Tesseract.js
    // For now, we'll simulate OCR processing with pattern matching
    const ocrResult = await this.performOCR(base64Data, file.type);

    return {
      name: file.name,
      size: file.size,
      category: this.inferCategory(file.name),
      mimeType: file.type,
      ocrResult,
      extractedText: ocrResult.text,
    };
  }

  /**
   * Perform OCR processing on file data
   */
  private async performOCR(base64Data: string, mimeType: string): Promise<OCRResult> {
    try {
      // In a production environment, you would integrate with:
      // 1. Tesseract.js for client-side OCR
      // 2. Google Vision API
      // 3. AWS Textract
      // 4. Azure Cognitive Services

      // For now, simulate OCR with pattern matching on filename
      const mockText = this.generateMockOCRText(base64Data);
      const extractedData = this.extractStructuredData(mockText);

      return {
        text: mockText,
        confidence: 0.85,
        extractedData,
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      return {
        text: '',
        confidence: 0,
        extractedData: {},
      };
    }
  }

  /**
   * Convert file to base64 string
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Infer document category from filename
   */
  private inferCategory(filename: string): string {
    const name = filename.toLowerCase();
    
    if (name.includes('license') || name.includes('id') || name.includes('passport')) {
      return 'identity';
    }
    
    if (name.includes('marriage') || name.includes('birth') || name.includes('death') || 
        name.includes('court') || name.includes('order')) {
      return 'legal';
    }
    
    if (name.includes('pay') || name.includes('tax') || name.includes('bank') || 
        name.includes('statement') || name.includes('w2') || name.includes('1099')) {
      return 'financial';
    }
    
    if (name.includes('deed') || name.includes('lease') || name.includes('title') || 
        name.includes('registration')) {
      return 'property';
    }
    
    return 'general';
  }

  /**
   * Generate mock OCR text for demonstration
   * In production, this would be replaced with actual OCR results
   */
  private generateMockOCRText(base64Data: string): string {
    // Simulate different document types based on data characteristics
    const documentTypes = [
      'CALIFORNIA DRIVER LICENSE\nJOHN MICHAEL SMITH\n123 MAIN STREET\nLOS ANGELES CA 90210\nDOB: 03/15/1985\nLIC: D1234567',
      'CERTIFICATE OF MARRIAGE\nState of California\nCounty of Los Angeles\nJohn M. Smith and Jane L. Doe\nMarried on June 15, 2010\nCertificate No: 2010-123456',
      'BIRTH CERTIFICATE\nState of California\nDepartment of Public Health\nChild: Emily Rose Smith\nDate of Birth: August 22, 2012\nParents: John M. Smith, Jane L. Smith',
      'BANK STATEMENT\nWells Fargo Bank\nAccount Holder: John M. Smith\n123 Main Street, Los Angeles CA 90210\nAccount Number: ****1234\nStatement Period: 01/01/2024 - 01/31/2024',
    ];
    
    // Return a random document type for simulation
    const randomIndex = Math.floor(Math.random() * documentTypes.length);
    return documentTypes[randomIndex];
  }

  /**
   * Extract structured data from OCR text using pattern matching
   */
  private extractStructuredData(text: string): OCRResult['extractedData'] {
    const data: OCRResult['extractedData'] = {
      names: [],
      dates: [],
      addresses: [],
      phones: [],
      emails: [],
      socialSecurityNumbers: [],
      caseNumbers: [],
    };

    // Name patterns
    const namePatterns = [
      /([A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+)/g, // First Middle Last
      /([A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+)/g,     // First M. Last
      /([A-Z][a-z]+ [A-Z][a-z]+)/g,             // First Last
    ];

    namePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        data.names!.push(...matches);
      }
    });

    // Date patterns
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{4}/g,        // MM/DD/YYYY
      /\d{1,2}-\d{1,2}-\d{4}/g,         // MM-DD-YYYY
      /\d{4}-\d{1,2}-\d{1,2}/g,         // YYYY-MM-DD
      /[A-Z][a-z]+ \d{1,2}, \d{4}/g,    // Month DD, YYYY
    ];

    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        data.dates!.push(...matches);
      }
    });

    // Address patterns
    const addressPatterns = [
      /\d+\s+[A-Z][a-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Boulevard|Blvd|Lane|Ln)[,\s]+[A-Z][a-z\s]+[,\s]+[A-Z]{2}\s+\d{5}/g,
    ];

    addressPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        data.addresses!.push(...matches);
      }
    });

    // Phone patterns
    const phonePatterns = [
      /\(\d{3}\)\s*\d{3}-\d{4}/g,       // (555) 123-4567
      /\d{3}-\d{3}-\d{4}/g,            // 555-123-4567
      /\d{3}\.\d{3}\.\d{4}/g,          // 555.123.4567
      /\d{10}/g,                       // 5551234567
    ];

    phonePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        data.phones!.push(...matches);
      }
    });

    // Email patterns
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = text.match(emailPattern);
    if (emailMatches) {
      data.emails!.push(...emailMatches);
    }

    // SSN patterns (last 4 digits only for privacy)
    const ssnPattern = /\*{3}-\*{2}-(\d{4})/g;
    const ssnMatches = text.match(ssnPattern);
    if (ssnMatches) {
      data.socialSecurityNumbers!.push(...ssnMatches);
    }

    // Case number patterns
    const casePatterns = [
      /Case\s+No[:.]\s*([A-Z0-9-]+)/gi,
      /Docket\s+No[:.]\s*([A-Z0-9-]+)/gi,
      /File\s+No[:.]\s*([A-Z0-9-]+)/gi,
    ];

    casePatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > 0) {
        data.caseNumbers!.push(...matches.map(match => match[1]));
      }
    });

    // Remove duplicates and empty arrays
    Object.keys(data).forEach(key => {
      const values = data[key as keyof typeof data];
      if (Array.isArray(values)) {
        const uniqueValues = [...new Set(values)];
        if (uniqueValues.length === 0) {
          delete data[key as keyof typeof data];
        } else {
          (data[key as keyof typeof data] as string[]) = uniqueValues;
        }
      }
    });

    return data;
  }

  /**
   * Auto-fill form fields based on OCR extracted data
   */
  autoFillFormData(ocrResults: OCRResult[], existingFormData: Record<string, any>): Record<string, any> {
    const formData = { ...existingFormData };

    // Combine all OCR results
    const allNames: string[] = [];
    const allDates: string[] = [];
    const allAddresses: string[] = [];
    const allPhones: string[] = [];
    const allEmails: string[] = [];

    ocrResults.forEach(result => {
      if (result.extractedData.names) allNames.push(...result.extractedData.names);
      if (result.extractedData.dates) allDates.push(...result.extractedData.dates);
      if (result.extractedData.addresses) allAddresses.push(...result.extractedData.addresses);
      if (result.extractedData.phones) allPhones.push(...result.extractedData.phones);
      if (result.extractedData.emails) allEmails.push(...result.extractedData.emails);
    });

    // Auto-fill petitioner information
    if (!formData.petitioner) formData.petitioner = {};
    
    if (!formData.petitioner.fullName && allNames.length > 0) {
      formData.petitioner.fullName = allNames[0];
    }
    
    if (!formData.petitioner.address && allAddresses.length > 0) {
      formData.petitioner.address = allAddresses[0];
    }
    
    if (!formData.petitioner.phone && allPhones.length > 0) {
      formData.petitioner.phone = allPhones[0];
    }
    
    if (!formData.petitioner.email && allEmails.length > 0) {
      formData.petitioner.email = allEmails[0];
    }

    // Auto-fill respondent information (use second name if available)
    if (!formData.respondent) formData.respondent = {};
    
    if (!formData.respondent.fullName && allNames.length > 1) {
      formData.respondent.fullName = allNames[1];
    }
    
    if (!formData.respondent.address && allAddresses.length > 1) {
      formData.respondent.address = allAddresses[1];
    }

    // Auto-fill case information
    if (!formData.case) formData.case = {};
    
    if (!formData.case.marriageDate && allDates.length > 0) {
      // Look for dates that could be marriage dates (typically in the past)
      const potentialMarriageDates = allDates.filter(date => {
        const parsed = new Date(date);
        const now = new Date();
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(now.getFullYear() - 10);
        
        return parsed < now && parsed > tenYearsAgo;
      });
      
      if (potentialMarriageDates.length > 0) {
        formData.case.marriageDate = this.formatDateForInput(potentialMarriageDates[0]);
      }
    }

    return formData;
  }

  /**
   * Format date string for HTML date input
   */
  private formatDateForInput(dateString: string): string {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  /**
   * Validate extracted data confidence and quality
   */
  validateExtractedData(ocrResult: OCRResult): boolean {
    if (!ocrResult.confidence || ocrResult.confidence < 0.5) {
      return false;
    }

    const hasUsefulData = Object.values(ocrResult.extractedData).some(
      dataArray => Array.isArray(dataArray) && dataArray.length > 0
    );

    return hasUsefulData;
  }
}

export const ocrProcessor = new OCRProcessor();
