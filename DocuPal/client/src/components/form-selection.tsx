import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { PetitionForm } from "@shared/schema";

interface FormSelectionProps {
  selectedForm: PetitionForm | null;
  onFormSelect: (form: PetitionForm) => void;
  onNext: () => void;
  language: string;
}

export default function FormSelection({ selectedForm, onFormSelect, onNext, language }: FormSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: forms, isLoading } = useQuery<PetitionForm[]>({
    queryKey: ["/api/petition-forms"],
  });

  // Auto-select form from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const formCode = urlParams.get('form');
    if (formCode && forms && !selectedForm) {
      const form = forms.find(f => f.code === formCode);
      if (form) {
        onFormSelect(form);
      }
    }
  }, [forms, selectedForm, onFormSelect]);

  const categories = [
    { id: "all", name: language === "es" ? "Todos los Formularios" : "All Forms" },
    { id: "family", name: language === "es" ? "Derecho Familiar" : "Family Law" },
    { id: "probate", name: language === "es" ? "Testamentos" : "Probate" },
    { id: "civil", name: language === "es" ? "Civil" : "Civil" },
    { id: "criminal", name: language === "es" ? "Criminal" : "Criminal" },
  ];

  const filteredForms = forms?.filter(form => {
    const matchesSearch = !searchTerm || 
      form.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || form.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const translations = {
    en: {
      title: "Select Your Legal Petition Form",
      filterLabel: "Filter by Category:",
      selectLabel: "Search and Select Your Petition Form:",
      selectPlaceholder: "Start typing to search forms (e.g., F for FL-100, divorce, probate)...",
      selectedTitle: "Selected Form Information",
      estimatedTime: "Est. completion:",
      requiredDocs: "Required documents:",
      continueButton: "Continue to Document Upload",
    },
    es: {
      title: "Seleccione Su Formulario de Petición Legal",
      filterLabel: "Filtrar por Categoría:",
      selectLabel: "Busque y Seleccione Su Formulario de Petición:",
      selectPlaceholder: "Comience a escribir para buscar formularios (ej. F para FL-100, divorcio, testamentos)...",
      selectedTitle: "Información del Formulario Seleccionado",
      estimatedTime: "Tiempo estimado:",
      requiredDocs: "Documentos requeridos:",
      continueButton: "Continuar a Cargar Documentos",
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
        <h2 className="text-lg font-semibold legal-gray mb-4">{t.title}</h2>
        
        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium legal-gray mb-2">{t.filterLabel}</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={categoryFilter === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category.id)}
                className={categoryFilter === category.id ? "bg-legal-blue" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Autocomplete Form Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium legal-gray mb-2">{t.selectLabel}</label>
          <div className="relative">
            <Input
              type="text"
              placeholder={t.selectPlaceholder}
              value={selectedForm ? `${selectedForm.code} - ${selectedForm.name}` : searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (selectedForm) onFormSelect(null as any); // Clear selection when typing
              }}
              className="pl-10 pr-10"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <i className="fas fa-chevron-down absolute right-3 top-3 text-gray-400"></i>
            
            {/* Autocomplete dropdown */}
            {searchTerm && !selectedForm && (
              <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                {filteredForms.slice(0, 8).map(form => (
                  <button
                    key={form.code}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-blue-50"
                    onClick={() => {
                      onFormSelect(form);
                      setSearchTerm("");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium legal-blue">{form.code}</span>
                        <span className="text-sm legal-gray ml-2">{form.name}</span>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {categories.find(c => c.id === form.category)?.name}
                      </span>
                    </div>
                  </button>
                ))}
                {filteredForms.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No forms match "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Form Info */}
        {selectedForm && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
            <h3 className="font-medium legal-blue mb-2">
              {selectedForm.code} - {selectedForm.name}
            </h3>
            <p className="text-sm legal-gray mb-3">{selectedForm.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="legal-gray">
                <i className="fas fa-clock mr-1"></i>
                {t.estimatedTime} {selectedForm.estimatedTime}
              </span>
              <span className="legal-gray">
                <i className="fas fa-file mr-1"></i>
                {t.requiredDocs} {selectedForm.requiredDocuments?.join(", ")}
              </span>
            </div>
          </div>
        )}

        <Button 
          className="w-full bg-legal-blue hover:bg-opacity-90 text-white"
          disabled={!selectedForm}
          onClick={onNext}
        >
          {t.continueButton}
        </Button>
      </CardContent>
    </Card>
  );
}
