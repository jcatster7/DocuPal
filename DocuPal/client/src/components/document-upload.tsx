import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  size: string;
  category: string;
  extractedText?: string;
}

interface DocumentUploadProps {
  uploadedFiles: UploadedFile[];
  onFilesUpdate: (files: UploadedFile[]) => void;
  onNext: () => void;
  onBack: () => void;
  language: string;
}

export default function DocumentUpload({ 
  uploadedFiles, 
  onFilesUpdate, 
  onNext, 
  onBack, 
  language 
}: DocumentUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append("documents", file);
      });
      
      const response = await apiRequest("POST", "/api/uploads", formData);
      return response.json();
    },
    onSuccess: (data) => {
      const newFiles = data.files.map((file: any) => ({
        name: file.name,
        size: formatFileSize(parseInt(file.size) || 0),
        category: file.category || "general",
        extractedText: file.extractedText || "",
      }));
      
      onFilesUpdate([...uploadedFiles, ...newFiles]);
      toast({
        title: language === "es" ? "Documentos cargados" : "Documents uploaded",
        description: language === "es" ? "Sus documentos han sido procesados exitosamente" : "Your documents have been processed successfully",
      });
    },
    onError: () => {
      toast({
        title: language === "es" ? "Error de carga" : "Upload error",
        description: language === "es" ? "Falló la carga de documentos" : "Failed to upload documents",
        variant: "destructive",
      });
    }
  });

  const translations = {
    en: {
      title: "Upload Supporting Documents",
      uploadArea: "Drag and drop your documents here, or click to browse",
      supportedFormats: "Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)",
      chooseFiles: "Choose Files",
      identity: "Identity Documents",
      identityItems: ["• Driver's License or State ID", "• Social Security Card", "• Passport"],
      legal: "Legal Documents", 
      legalItems: ["• Marriage Certificate", "• Birth Certificates", "• Previous Court Orders"],
      financial: "Financial Documents",
      financialItems: ["• Pay Stubs", "• Tax Returns", "• Bank Statements"],
      property: "Property Documents",
      propertyItems: ["• Property Deeds", "• Lease Agreements", "• Vehicle Registrations"],
      uploadedTitle: "Uploaded Documents",
      processed: "Processed",
      backButton: "Back to Form Selection",
      continueButton: "Continue to Form Questions",
    },
    es: {
      title: "Cargar Documentos de Apoyo",
      uploadArea: "Arrastre y suelte sus documentos aquí, o haga clic para navegar",
      supportedFormats: "Formatos compatibles: PDF, JPG, PNG, DOC, DOCX (Máx. 10MB cada uno)",
      chooseFiles: "Elegir Archivos",
      identity: "Documentos de Identidad",
      identityItems: ["• Licencia de Conducir o ID Estatal", "• Tarjeta de Seguro Social", "• Pasaporte"],
      legal: "Documentos Legales",
      legalItems: ["• Certificado de Matrimonio", "• Certificados de Nacimiento", "• Órdenes Judiciales Previas"],
      financial: "Documentos Financieros",
      financialItems: ["• Talones de Pago", "• Declaraciones de Impuestos", "• Estados de Cuenta Bancarios"],
      property: "Documentos de Propiedad",
      propertyItems: ["• Escrituras de Propiedad", "• Contratos de Arrendamiento", "• Registros de Vehículos"],
      uploadedTitle: "Documentos Cargados",
      processed: "Procesado",
      backButton: "Volver a Selección de Formulario",
      continueButton: "Continuar a Preguntas del Formulario",
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadMutation.mutate(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadMutation.mutate(files);
    }
    // Reset input
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFilesUpdate(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const documentCategories = [
    {
      icon: "fas fa-id-card",
      title: t.identity,
      items: t.identityItems,
      category: "identity"
    },
    {
      icon: "fas fa-certificate",
      title: t.legal,
      items: t.legalItems,
      category: "legal"
    },
    {
      icon: "fas fa-dollar-sign",
      title: t.financial,
      items: t.financialItems,
      category: "financial"
    },
    {
      icon: "fas fa-home",
      title: t.property,
      items: t.propertyItems,
      category: "property"
    }
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold legal-gray mb-4">{t.title}</h2>
        
        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors cursor-pointer ${
            dragOver ? 'border-legal-blue bg-blue-50' : 'border-gray-300 hover:border-legal-blue'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
          <p className="legal-gray mb-2">{t.uploadArea}</p>
          <p className="text-sm text-gray-500 mb-4">{t.supportedFormats}</p>
          <Button 
            className="bg-legal-blue text-white hover:bg-opacity-90"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {language === "es" ? "Cargando..." : "Uploading..."}
              </>
            ) : (
              <>
                <i className="fas fa-folder-open mr-2"></i>
                {t.chooseFiles}
              </>
            )}
          </Button>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        {/* Document Categories */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {documentCategories.map((category, index) => (
            <div key={index} className="border border-gray-200 rounded p-4">
              <h3 className="font-medium legal-gray mb-2">
                <i className={`${category.icon} mr-2 legal-blue`}></i>
                {category.title}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium legal-gray mb-3">{t.uploadedTitle}</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-file-pdf legal-red"></i>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {language === "es" ? "Categoría" : "Category"}: {file.category} | {file.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs legal-green">
                      <i className="fas fa-check mr-1"></i>
                      {t.processed}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <i className="fas fa-arrow-left mr-2"></i>
            {t.backButton}
          </Button>
          <Button 
            className="bg-legal-blue text-white hover:bg-opacity-90"
            onClick={onNext}
          >
            {t.continueButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
