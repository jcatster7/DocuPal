import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PetitionForm } from "@shared/schema";
import { MOCK_FORMS } from "@/data/mock-forms";

interface FormSelectionProps {
  selectedForm: PetitionForm | null;
  onFormSelect: (form: PetitionForm) => void;
  onNext: () => void;
  language: string;
}

export default function FormSelection({ selectedForm, onFormSelect, onNext, language }: FormSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: apiForms, isLoading, error } = useQuery<PetitionForm[]>({
    queryKey: ["/api/petition-forms"],
    queryFn: async () => {
      try {
        console.log("Fetching forms from API...");
        const response = await fetch("/api/petition-forms");
        console.log("API Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch forms: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Forms data received:", data);
        return data;
      } catch (error) {
        console.error("Error fetching forms:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Use mock data if API fails, otherwise use API data
  const forms = apiForms || MOCK_FORMS;
  const isUsingMockData = !apiForms && error;

  // Memoized categories to prevent unnecessary re-renders
  const categories = useMemo(() => [
    { id: "all", name: language === "es" ? "Todos los Formularios" : "All Forms", color: "bg-legal-blue" },
    { id: "family", name: language === "es" ? "Derecho Familiar" : "Family Law", color: "bg-legal-green" },
    { id: "probate", name: language === "es" ? "Testamentos" : "Probate", color: "bg-legal-purple" },
    { id: "civil", name: language === "es" ? "Civil" : "Civil", color: "bg-legal-gray" },
    { id: "criminal", name: language === "es" ? "Criminal" : "Criminal", color: "bg-legal-red" },
  ], [language]);

  // Memoized filtered forms based on selected category
  const filteredForms = useMemo(() => {
    if (!forms) return [];
    
    if (selectedCategory === "all") {
      return forms;
    }
    
    return forms.filter(form => form.category === selectedCategory);
  }, [forms, selectedCategory]);

  // Auto-select form from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const formCode = urlParams.get('form');
    if (formCode && forms && !selectedForm) {
      const form = forms.find(f => f.code === formCode);
      if (form) {
        onFormSelect(form);
        setSelectedCategory(form.category);
      }
    }
  }, [forms, selectedForm, onFormSelect]);

  // Optimized form selection handler
  const handleFormSelect = useCallback((form: PetitionForm) => {
    onFormSelect(form);
  }, [onFormSelect]);

  // Optimized category filter handler
  const handleCategoryFilter = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    // Clear any previously selected form when changing categories
    if (selectedForm) {
      onFormSelect(null as any);
    }
  }, [selectedForm, onFormSelect]);

  const translations = {
    en: {
      title: "Select Your Legal Petition Form",
      subtitle: "Choose a category below to see available forms",
      continueButton: "Continue to Document Upload",
      mockDataNotice: "Using demo data - forms will work offline",
      noFormsInCategory: "No forms available in this category",
      formDetails: "Form Details",
      estimatedTime: "Est. completion:",
      requiredDocs: "Required documents:",
      selectFormPrompt: "Please select a form above to continue",
    },
    es: {
      title: "Seleccione Su Formulario de Petición Legal",
      subtitle: "Elija una categoría a continuación para ver los formularios disponibles",
      continueButton: "Continuar a Cargar Documentos",
      mockDataNotice: "Usando datos de demostración - formularios funcionan sin conexión",
      noFormsInCategory: "No hay formularios disponibles en esta categoría",
      formDetails: "Detalles del Formulario",
      estimatedTime: "Tiempo estimado:",
      requiredDocs: "Documentos requeridos:",
      selectFormPrompt: "Por favor seleccione un formulario arriba para continuar",
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-16 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold legal-gray mb-2">{t.title}</h2>
        <p className="text-sm text-gray-600 mb-6">{t.subtitle}</p>
        
        {/* Mock Data Notice */}
        {isUsingMockData && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <i className="fas fa-info-circle mr-2"></i>
              {t.mockDataNotice}
            </p>
          </div>
        )}
        
        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium legal-gray mb-3">Filter by Category:</label>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="lg"
                onClick={() => handleCategoryFilter(category.id)}
                className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id 
                    ? `${category.color} text-white shadow-md` 
                    : "hover:shadow-sm hover:scale-105"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Forms Grid */}
        {filteredForms.length > 0 ? (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredForms.map(form => (
                <Card 
                  key={form.code} 
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                    selectedForm?.code === form.code 
                      ? 'border-legal-blue shadow-lg scale-[1.02]' 
                      : 'border-gray-200 hover:border-legal-blue'
                  }`}
                  onClick={() => handleFormSelect(form)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-legal-blue">{form.code}</h3>
                      <Badge 
                        variant="secondary" 
                        className={categories.find(c => c.id === form.category)?.color}
                      >
                        {categories.find(c => c.id === form.category)?.name}
                      </Badge>
                    </div>
                    
                    <h4 className="text-md font-semibold text-legal-gray mb-2">{form.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{form.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <i className="fas fa-clock mr-2 text-legal-blue"></i>
                        <span>{t.estimatedTime} {form.estimatedTime}</span>
                      </div>
                      {form.requiredDocuments && form.requiredDocuments.length > 0 && (
                        <div className="flex items-start">
                          <i className="fas fa-file mr-2 mt-0.5 text-legal-blue"></i>
                          <span>{t.requiredDocs} {form.requiredDocuments.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-folder-open text-6xl"></i>
            </div>
            <h3 className="text-lg font-medium text-legal-gray mb-2">
              {t.noFormsInCategory}
            </h3>
            <p className="text-gray-500">
              Try selecting a different category
            </p>
          </div>
        )}

        {/* Selected Form Info */}
        {selectedForm && (
          <div className="mb-6 p-4 bg-legal-blue bg-opacity-10 border border-legal-blue rounded-lg">
            <h3 className="font-semibold text-legal-blue mb-3 flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              {t.formDetails}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-legal-gray mb-2">
                  {selectedForm.code} - {selectedForm.name}
                </h4>
                <p className="text-sm text-gray-600 mb-3">{selectedForm.description}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <i className="fas fa-clock mr-2 text-legal-blue"></i>
                  <span>{t.estimatedTime} {selectedForm.estimatedTime}</span>
                </div>
                {selectedForm.requiredDocuments && selectedForm.requiredDocuments.length > 0 && (
                  <div className="flex items-start text-gray-600">
                    <i className="fas fa-file mr-2 mt-0.5 text-legal-blue"></i>
                    <span>{t.requiredDocs} {selectedForm.requiredDocuments.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <Button 
          className="w-full bg-legal-blue hover:bg-opacity-90 text-white py-3 text-lg font-medium"
          disabled={!selectedForm}
          onClick={onNext}
        >
          {selectedForm ? t.continueButton : t.selectFormPrompt}
        </Button>
      </CardContent>
    </Card>
  );
}
