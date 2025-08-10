import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { PetitionForm } from "@shared/schema";

interface DownloadSectionProps {
  generatedDocuments: Array<{
    type: string;
    filename: string;
    size: string;
    downloadUrl: string;
  }>;
  selectedForm: PetitionForm | null;
  onStartNew: () => void;
  language: string;
}

export default function DownloadSection({
  generatedDocuments,
  selectedForm,
  onStartNew,
  language,
}: DownloadSectionProps) {
  
  const translations = {
    en: {
      title: "Documents Generated Successfully!",
      subtitle: "Your petition documents have been generated and are ready for download.",
      downloadAll: "Download All Documents (ZIP)",
      nextSteps: "Next Steps",
      steps: [
        "Review all downloaded documents carefully for accuracy",
        "Make copies of all documents for your records", 
        "File the original petition with the appropriate court",
        "Serve the respondent according to California law",
        "File the proof of service with the court"
      ],
      startNew: "Create Another Petition",
      browseLibrary: "Browse Form Library",
      download: "Download",
    },
    es: {
      title: "¡Documentos Generados Exitosamente!",
      subtitle: "Sus documentos de petición han sido generados y están listos para descargar.",
      downloadAll: "Descargar Todos los Documentos (ZIP)",
      nextSteps: "Próximos Pasos",
      steps: [
        "Revise todos los documentos descargados cuidadosamente para verificar su exactitud",
        "Haga copias de todos los documentos para sus registros",
        "Presente la petición original en el tribunal apropiado",
        "Notifique al demandado según la ley de California",
        "Presente la prueba de notificación en el tribunal"
      ],
      startNew: "Crear Otra Petición",
      browseLibrary: "Explorar Biblioteca de Formularios",
      download: "Descargar",
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleDownload = (downloadUrl: string, filename: string) => {
    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    // In a real implementation, this would create and download a ZIP file
    generatedDocuments.forEach(doc => {
      setTimeout(() => handleDownload(doc.downloadUrl, doc.filename), 100);
    });
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "petition":
        return { icon: "fas fa-file-pdf", color: "legal-red" };
      case "proof_of_service":
        return { icon: "fas fa-file-alt", color: "legal-blue" };
      case "exhibits":
        return { icon: "fas fa-folder", color: "legal-purple" };
      default:
        return { icon: "fas fa-file", color: "legal-gray" };
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <i className="fas fa-check-circle text-4xl legal-green mb-4"></i>
          <h2 className="text-xl font-semibold legal-gray mb-2">{t.title}</h2>
          <p className="legal-gray">{t.subtitle}</p>
        </div>

        {/* Download Links */}
        <div className="space-y-3 mb-6">
          {generatedDocuments.map((doc, index) => {
            const iconInfo = getDocumentIcon(doc.type);
            return (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded">
                <div className="flex items-center space-x-3">
                  <i className={`${iconInfo.icon} text-xl ${iconInfo.color}`}></i>
                  <div>
                    <h4 className="font-medium legal-gray">{doc.filename}</h4>
                    <p className="text-sm text-gray-500">({doc.size})</p>
                  </div>
                </div>
                <Button 
                  className="bg-legal-blue text-white hover:bg-opacity-90"
                  size="sm"
                  onClick={() => handleDownload(doc.downloadUrl, doc.filename)}
                >
                  <i className="fas fa-download mr-1"></i>
                  {t.download}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Download All */}
        <div className="text-center mb-6">
          <Button 
            className="bg-legal-green text-white hover:bg-opacity-90"
            size="lg"
            onClick={handleDownloadAll}
          >
            <i className="fas fa-download mr-2"></i>
            {t.downloadAll}
          </Button>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <h3 className="font-medium legal-blue mb-2">{t.nextSteps}</h3>
          <ol className="text-sm legal-gray space-y-2 list-decimal list-inside">
            {t.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onStartNew}
            className="legal-blue font-medium"
          >
            <i className="fas fa-plus mr-2"></i>
            {t.startNew}
          </Button>
          <Link href="/library">
            <Button variant="outline" className="legal-gray">
              <i className="fas fa-book mr-2"></i>
              {t.browseLibrary}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
