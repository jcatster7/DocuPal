import { PDFDocument, PDFForm, PDFTextField, PDFCheckBox, PDFDropdown, rgb } from 'pdf-lib';
import type { PetitionForm } from '@shared/schema';

export interface GeneratedDocument {
  type: 'petition' | 'proof_of_service' | 'exhibits';
  filename: string;
  pdfBytes: Uint8Array;
  size: string;
}

export class PDFGenerator {
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async generatePetitionForm(
    selectedForm: PetitionForm,
    formData: Record<string, any>
  ): Promise<GeneratedDocument> {
    // Create new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Standard letter size
    const { width, height } = page.getSize();
    
    // Add header
    page.drawText(`${selectedForm.code} - ${selectedForm.name}`, {
      x: 50,
      y: height - 50,
      size: 16,
      color: rgb(0.11, 0.25, 0.72), // Legal blue
    });

    page.drawText('SUPERIOR COURT OF CALIFORNIA', {
      x: 50,
      y: height - 80,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText(`COUNTY OF ${(formData.case?.county || 'LOS ANGELES').toUpperCase()}`, {
      x: 50,
      y: height - 100,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // Petitioner Information Section
    let yPosition = height - 150;
    page.drawText('PETITIONER INFORMATION', {
      x: 50,
      y: yPosition,
      size: 14,
      color: rgb(0.11, 0.25, 0.72),
    });

    yPosition -= 30;
    if (formData.petitioner?.fullName) {
      page.drawText(`Name: ${formData.petitioner.fullName}`, {
        x: 50,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;
    }

    if (formData.petitioner?.address) {
      page.drawText(`Address: ${formData.petitioner.address}`, {
        x: 50,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;
    }

    if (formData.petitioner?.phone) {
      page.drawText(`Phone: ${formData.petitioner.phone}`, {
        x: 50,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;
    }

    if (formData.petitioner?.email) {
      page.drawText(`Email: ${formData.petitioner.email}`, {
        x: 50,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;
    }

    // Respondent Information Section (for family law forms)
    if (selectedForm.category === 'family' && formData.respondent) {
      yPosition -= 20;
      page.drawText('RESPONDENT INFORMATION', {
        x: 50,
        y: yPosition,
        size: 14,
        color: rgb(0.11, 0.25, 0.72),
      });

      yPosition -= 30;
      if (formData.respondent.fullName) {
        page.drawText(`Name: ${formData.respondent.fullName}`, {
          x: 50,
          y: yPosition,
          size: 10,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
      }

      if (formData.respondent.address) {
        page.drawText(`Address: ${formData.respondent.address}`, {
          x: 50,
          y: yPosition,
          size: 10,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
      }
    }

    // Case Information Section
    if (formData.case) {
      yPosition -= 20;
      page.drawText('CASE INFORMATION', {
        x: 50,
        y: yPosition,
        size: 14,
        color: rgb(0.11, 0.25, 0.72),
      });

      yPosition -= 30;
      if (formData.case.marriageDate) {
        page.drawText(`Date of Marriage: ${formData.case.marriageDate}`, {
          x: 50,
          y: yPosition,
          size: 10,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
      }

      if (formData.case.separationDate) {
        page.drawText(`Date of Separation: ${formData.case.separationDate}`, {
          x: 50,
          y: yPosition,
          size: 10,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
      }
    }

    // Children Information
    if (formData.hasMinorChildren && formData.children?.length > 0) {
      yPosition -= 20;
      page.drawText('MINOR CHILDREN', {
        x: 50,
        y: yPosition,
        size: 14,
        color: rgb(0.11, 0.25, 0.72),
      });

      yPosition -= 30;
      formData.children.forEach((child: any, index: number) => {
        if (child.name) {
          page.drawText(`${index + 1}. ${child.name} - DOB: ${child.dateOfBirth || 'N/A'} - Gender: ${child.gender || 'N/A'}`, {
            x: 50,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
          });
          yPosition -= 20;
        }
      });
    }

    // Footer
    page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: 50,
      size: 8,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText('This document was generated by CA Legal Petition Auto-Filler', {
      x: 50,
      y: 35,
      size: 8,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    
    return {
      type: 'petition',
      filename: `${selectedForm.code}-filled.pdf`,
      pdfBytes,
      size: this.formatFileSize(pdfBytes.length),
    };
  }

  async generateProofOfService(
    selectedForm: PetitionForm,
    formData: Record<string, any>
  ): Promise<GeneratedDocument> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();

    // Header
    page.drawText('POS-040 - PROOF OF SERVICE BY MAIL', {
      x: 50,
      y: height - 50,
      size: 16,
      color: rgb(0.11, 0.25, 0.72),
    });

    page.drawText('SUPERIOR COURT OF CALIFORNIA', {
      x: 50,
      y: height - 80,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText(`COUNTY OF ${(formData.case?.county || 'LOS ANGELES').toUpperCase()}`, {
      x: 50,
      y: height - 100,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // Form content
    let yPosition = height - 150;
    page.drawText('I served the following documents:', {
      x: 50,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;
    page.drawText(`☐ ${selectedForm.code} - ${selectedForm.name}`, {
      x: 70,
      y: yPosition,
      size: 10,
      color: rgb(0, 0, 0),
    });

    yPosition -= 40;
    page.drawText('Person served:', {
      x: 50,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    yPosition -= 25;
    page.drawText(`Name: ${formData.respondent?.fullName || '_________________________'}`, {
      x: 70,
      y: yPosition,
      size: 10,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;
    page.drawText(`Address: ${formData.respondent?.address || '_________________________'}`, {
      x: 70,
      y: yPosition,
      size: 10,
      color: rgb(0, 0, 0),
    });

    yPosition -= 40;
    page.drawText('Date of service: _________________', {
      x: 50,
      y: yPosition,
      size: 10,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;
    page.drawText('Method of service:', {
      x: 50,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    yPosition -= 25;
    page.drawText('☐ By mail to the address shown above', {
      x: 70,
      y: yPosition,
      size: 10,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;
    page.drawText('☐ Personal service', {
      x: 70,
      y: yPosition,
      size: 10,
      color: rgb(0, 0, 0),
    });

    // Signature section
    yPosition -= 60;
    page.drawText('Server information:', {
      x: 50,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    yPosition -= 25;
    page.drawText(`Name: ${formData.petitioner?.fullName || '_________________________'}`, {
      x: 70,
      y: yPosition,
      size: 10,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;
    page.drawText(`Address: ${formData.petitioner?.address || '_________________________'}`, {
      x: 70,
      y: yPosition,
      size: 10,
      color: rgb(0, 0, 0),
    });

    yPosition -= 40;
    page.drawText('Signature: _________________________     Date: _________', {
      x: 70,
      y: yPosition,
      size: 10,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    
    return {
      type: 'proof_of_service',
      filename: 'POS-040-proof-of-service.pdf',
      pdfBytes,
      size: this.formatFileSize(pdfBytes.length),
    };
  }

  async generateExhibitsIndex(uploadedFiles: Array<any>): Promise<GeneratedDocument> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();

    // Header
    page.drawText('EXHIBITS INDEX', {
      x: 50,
      y: height - 50,
      size: 16,
      color: rgb(0.11, 0.25, 0.72),
    });

    page.drawText('Supporting Documents for Legal Petition', {
      x: 50,
      y: height - 80,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // Table headers
    let yPosition = height - 120;
    page.drawText('Exhibit', {
      x: 50,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText('Document Name', {
      x: 120,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText('Category', {
      x: 350,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    page.drawText('Size', {
      x: 450,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });

    // Draw line under headers
    page.drawLine({
      start: { x: 50, y: yPosition - 5 },
      end: { x: 550, y: yPosition - 5 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // List uploaded files
    yPosition -= 25;
    uploadedFiles.forEach((file, index) => {
      const exhibitNumber = String.fromCharCode(65 + index); // A, B, C, etc.
      
      page.drawText(exhibitNumber, {
        x: 50,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });

      page.drawText(file.name.length > 30 ? file.name.substring(0, 27) + '...' : file.name, {
        x: 120,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });

      page.drawText(file.category || 'General', {
        x: 350,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });

      page.drawText(file.size || 'N/A', {
        x: 450,
        y: yPosition,
        size: 10,
        color: rgb(0, 0, 0),
      });

      yPosition -= 20;
    });

    if (uploadedFiles.length === 0) {
      page.drawText('No supporting documents were uploaded.', {
        x: 50,
        y: yPosition,
        size: 10,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Footer
    page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: 50,
      size: 8,
      color: rgb(0.5, 0.5, 0.5),
    });

    const pdfBytes = await pdfDoc.save();
    
    return {
      type: 'exhibits',
      filename: 'exhibits-index.pdf',
      pdfBytes,
      size: this.formatFileSize(pdfBytes.length),
    };
  }

  async generateAllDocuments(
    selectedForm: PetitionForm,
    formData: Record<string, any>,
    uploadedFiles: Array<any>
  ): Promise<GeneratedDocument[]> {
    const documents: GeneratedDocument[] = [];

    try {
      // Generate main petition form
      const petition = await this.generatePetitionForm(selectedForm, formData);
      documents.push(petition);

      // Generate proof of service (for applicable forms)
      if (selectedForm.category === 'family' || selectedForm.category === 'civil') {
        const proofOfService = await this.generateProofOfService(selectedForm, formData);
        documents.push(proofOfService);
      }

      // Generate exhibits index if files were uploaded
      if (uploadedFiles.length > 0) {
        const exhibitsIndex = await this.generateExhibitsIndex(uploadedFiles);
        documents.push(exhibitsIndex);
      }

      return documents;
    } catch (error) {
      console.error('Error generating PDF documents:', error);
      throw new Error('Failed to generate PDF documents');
    }
  }

  createDownloadUrl(pdfBytes: Uint8Array, filename: string): string {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }

  downloadPDF(pdfBytes: Uint8Array, filename: string): void {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  }

  async downloadAllAsZip(documents: GeneratedDocument[]): Promise<void> {
    // For now, download each file individually
    // In a production environment, you would want to use a library like JSZip
    documents.forEach((doc, index) => {
      setTimeout(() => {
        this.downloadPDF(doc.pdfBytes, doc.filename);
      }, index * 100); // Stagger downloads to avoid browser blocking
    });
  }
}

export const pdfGenerator = new PDFGenerator();
