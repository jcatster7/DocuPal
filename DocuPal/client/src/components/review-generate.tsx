import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PetitionForm } from "@shared/schema";

interface ReviewGenerateProps {
  selectedForm: PetitionForm | null;
  formData: Record<string, any>;
  uploadedFiles: Array<any>;
  onDocumentsGenerated: (documents: Array<any>) => void;
  onBack: () => void;
  language: string;
  sessionId: string;
}

export default function ReviewGenerate({
  selectedForm,
  formData,
  uploadedFiles,
  onDocumentsGenerated,
  onBack,
  language,
  sessionId,
}: ReviewGenerateProps) {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate-documents", {
        submissionId: sessionId,
        formCode: selectedForm?.code,
        formData,
        uploadedFiles,
      });
      return response.json();
    },
    onSuccess: (data) => {
      onDocumentsGenerated(data.documents);
      toast({
        title: language === "es" ? "Documentos generados" : "Documents generated",
        description: language === "es" ? "Sus documentos están listos para descargar" : "Your documents are ready for download",
      });
    },
    onError: () => {
      toast({
        title: language === "es" ? "Error de generación" : "Generation error",
        description: language === "es" ? "Falló la generación de documentos" : "Failed to generate documents",
        variant: "destructive",
      });
    }
  });

  const translations = {
    en: {
      title: "Review and Generate Documents",
      summaryTitle: "Form Summary",
      formType: "Form Type:",
      caseType: "Case Type:",
      filingCounty: "Filing County:",
      documentsUploaded: "Documents Uploaded:",
      documentsToGenerate: "Documents to be Generated:",
      mainPetition: "Main petition form with all your information",
      proofOfService: "Document to prove service to respondent",
      exhibitsIndex: "Organized index of your supporting documents",
      ready: "Ready",
      legalNoticeTitle: "Important Legal Notice",
      legalNoticeText1: "This tool provides document automation assistance only and does not constitute legal advice. The generated documents are based on the information you provided and should be reviewed carefully before filing.",
      legalNoticeText2: "We recommend consulting with a qualified attorney if you have questions about your legal rights or the filing process.",
      legalNoticeText3: "By using this service, you acknowledge that you understand these limitations.",
      disclaimerText: "I understand that this is a document automation tool and not legal advice. I have reviewed the information above and acknowledge the limitations of this service. I understand that I should review all generated documents carefully before filing.",
      backButton: "Back to Form Questions",
      generateButton: "Generate and Download Documents",
      generating: "Generating Documents...",
    },
    es: {
      title: "Revisar y Generar Documentos",
      summaryTitle: "Resumen del Formulario",
      formType: "Tipo de Formulario:",
      caseType: "Tipo de Caso:",
      filingCounty: "Condado de Presentación:",
      documentsUploaded: "Documentos Cargados:",
      documentsToGenerate: "Documentos a Generar:",
      mainPetition: "Formulario de petición principal con toda su información",
      proofOfService: "Documento para probar la notificación al demandado",
      exhibitsIndex: "Índice organizado de sus documentos de apoyo",
      ready: "Listo",
      legalNoticeTitle: "Aviso Legal Importante",
      legalNoticeText1: "Esta herramienta proporciona asistencia de automatización de documentos solamente y no constituye asesoramiento legal. Los documentos generados se basan en la información que proporcionó y deben revisarse cuidadosamente antes de presentarse.",
      legalNoticeText2: "Recomendamos consultar con un abogado calificado si tiene preguntas sobre sus derechos legales o el proceso de presentación.",
      legalNoticeText3: "Al usar este servicio, usted reconoce que entiende estas limitaciones.",
      disclaimerText: "Entiendo que esta es una herramienta de automatización de documentos y no asesoramiento legal. He revisado la información anterior y reconozco las limitaciones de este servicio. Entiendo que debo revisar todos los documentos generados cuidadosamente antes de presentarlos.",
      backButton: "Volver a Preguntas del Formulario",
      generateButton: "Generar y Descargar Documentos",
      generating: "Generando Documentos...",
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const documentsToGenerate = [
    {
      icon: "fas fa-file-pdf",
      iconColor: "legal-red",
      title: `${selectedForm?.code} - ${selectedForm?.name}`,
      description: t.mainPetition,
    },
    {
      icon: "fas fa-file-alt",
      iconColor: "legal-blue",
      title: "POS-040 - Proof of Service",
      description: t.proofOfService,
    },
    {
      icon: "fas fa-folder",
      iconColor: "legal-purple",
      title: "Exhibits Index",
      description: t.exhibitsIndex,
    },
  ];

  if (!selectedForm) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No form selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold legal-gray mb-4">{t.title}</h2>
        
        {/* Form Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <h3 className="font-medium legal-blue mb-2">{t.summaryTitle}</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{t.formType}</span> <span>{selectedForm.code}</span>
            </div>
            <div>
              <span className="font-medium">{t.caseType}</span> <span>{selectedForm.name}</span>
            </div>
            <div>
              <span className="font-medium">{t.filingCounty}</span> <span>{formData.case?.county || "Not specified"}</span>
            </div>
            <div>
              <span className="font-medium">{t.documentsUploaded}</span> <span>{uploadedFiles.length}</span>
            </div>
          </div>
        </div>

        {/* Generated Documents */}
        <div className="space-y-4 mb-6">
          <h3 className="font-medium legal-gray">{t.documentsToGenerate}</h3>
          
          {documentsToGenerate.map((doc, index) => (
            <div key={index} className="border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`${doc.icon} text-xl ${doc.iconColor}`}></i>
                  <div>
                    <h4 className="font-medium legal-gray">{doc.title}</h4>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                  </div>
                </div>
                <span className="text-legal-green text-sm">
                  <i className="fas fa-check mr-1"></i>
                  {t.ready}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
          <div className="flex items-start space-x-3">
            <i className="fas fa-exclamation-triangle text-yellow-600 mt-1"></i>
            <div>
              <h3 className="font-medium text-yellow-800 mb-2">{t.legalNoticeTitle}</h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>{t.legalNoticeText1}</p>
                <p>{t.legalNoticeText2}</p>
                <p>{t.legalNoticeText3}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Checkbox */}
        <div className="mb-6">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="disclaimerAccepted"
              checked={disclaimerAccepted}
              onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
              className="mt-1"
            />
            <label htmlFor="disclaimerAccepted" className="text-sm legal-gray leading-relaxed">
              {t.disclaimerText}
            </label>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <i className="fas fa-arrow-left mr-2"></i>
            {t.backButton}
          </Button>
          <Button 
            className="bg-legal-green text-white hover:bg-opacity-90"
            disabled={!disclaimerAccepted || generateMutation.isPending}
            onClick={() => generateMutation.mutate()}
          >
            {generateMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {t.generating}
              </>
            ) : (
              <>
                <i className="fas fa-download mr-2"></i>
                {t.generateButton}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
