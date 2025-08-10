import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import FormSelection from "./form-selection";
import DocumentUpload from "./document-upload";
import SmartQuestionnaire from "./smart-questionnaire";
import ReviewGenerate from "./review-generate";
import DownloadSection from "./download-section";
import type { PetitionForm } from "@shared/schema";

interface PetitionWizardProps {
  language: string;
}

interface WizardState {
  selectedForm: PetitionForm | null;
  uploadedFiles: Array<{
    name: string;
    size: string;
    category: string;
    extractedText?: string;
  }>;
  formData: Record<string, any>;
  generatedDocuments: Array<{
    type: string;
    filename: string;
    size: string;
    downloadUrl: string;
  }>;
}

export default function PetitionWizard({ language }: PetitionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId] = useState(() => localStorage.getItem("sessionId") || crypto.randomUUID());
  
  const [wizardState, setWizardState] = useState<WizardState>({
    selectedForm: null,
    uploadedFiles: [],
    formData: {},
    generatedDocuments: [],
  });

  // Save session ID if not exists
  useEffect(() => {
    if (!localStorage.getItem("sessionId")) {
      localStorage.setItem("sessionId", sessionId);
    }
  }, [sessionId]);

  // Load user profile for form pre-filling
  const { data: userProfile } = useQuery({
    queryKey: ["/api/profile", sessionId],
    enabled: !!sessionId,
  });

  const steps = [
    { number: 1, name: "Select Form", component: "selection" },
    { number: 2, name: "Upload Documents", component: "upload" },
    { number: 3, name: "Complete Form", component: "questionnaire" },
    { number: 4, name: "Review & Generate", component: "review" },
    { number: 5, name: "Download", component: "download" },
  ];

  const updateWizardState = (updates: Partial<WizardState>) => {
    setWizardState(prev => ({ ...prev, ...updates }));
  };

  const navigateToStep = (step: number) => {
    setCurrentStep(step);
  };

  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4 text-sm mb-4">
          {steps.slice(0, -1).map((step, index) => (
            <div key={step.number} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    step.number <= currentStep 
                      ? 'bg-legal-blue text-white' 
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {step.number}
                </div>
                <span 
                  className={`${
                    step.number <= currentStep 
                      ? 'legal-blue font-medium' 
                      : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 2 && (
                <div className="w-8 h-px bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 max-w-2xl mx-auto">
          <div 
            className="bg-legal-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <FormSelection
            selectedForm={wizardState.selectedForm}
            onFormSelect={(form) => updateWizardState({ selectedForm: form })}
            onNext={() => navigateToStep(2)}
            language={language}
          />
        )}

        {currentStep === 2 && (
          <DocumentUpload
            uploadedFiles={wizardState.uploadedFiles}
            onFilesUpdate={(files) => updateWizardState({ uploadedFiles: files })}
            onNext={() => navigateToStep(3)}
            onBack={() => navigateToStep(1)}
            language={language}
          />
        )}

        {currentStep === 3 && (
          <SmartQuestionnaire
            selectedForm={wizardState.selectedForm}
            uploadedFiles={wizardState.uploadedFiles}
            formData={wizardState.formData}
            userProfile={userProfile}
            onFormDataUpdate={(data) => updateWizardState({ formData: data })}
            onNext={() => navigateToStep(4)}
            onBack={() => navigateToStep(2)}
            language={language}
            sessionId={sessionId}
          />
        )}

        {currentStep === 4 && (
          <ReviewGenerate
            selectedForm={wizardState.selectedForm}
            formData={wizardState.formData}
            uploadedFiles={wizardState.uploadedFiles}
            onDocumentsGenerated={(documents) => {
              updateWizardState({ generatedDocuments: documents });
              navigateToStep(5);
            }}
            onBack={() => navigateToStep(3)}
            language={language}
            sessionId={sessionId}
          />
        )}

        {currentStep === 5 && (
          <DownloadSection
            generatedDocuments={wizardState.generatedDocuments}
            selectedForm={wizardState.selectedForm}
            onStartNew={() => {
              setWizardState({
                selectedForm: null,
                uploadedFiles: [],
                formData: {},
                generatedDocuments: [],
              });
              navigateToStep(1);
            }}
            language={language}
          />
        )}
      </div>
    </div>
  );
}
