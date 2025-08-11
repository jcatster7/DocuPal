import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { PetitionForm } from "@shared/schema";
import { MOCK_FORMS } from "@/data/mock-forms";

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface FormSelectionProps {
  selectedForm: PetitionForm | null;
  onFormSelect: (form: PetitionForm) => void;
  onNext: () => void;
  language: string;
}

export default function FormSelection({ selectedForm, onFormSelect, onNext, language }: FormSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
    { id: "all", name: language === "es" ? "Todos los Formularios" : "All Forms" },
    { id: "family", name: language === "es" ? "Derecho Familiar" : "Family Law" },
    { id: "probate", name: language === "es" ? "Testamentos" : "Probate" },
    { id: "civil", name: language === "es" ? "Civil" : "Civil" },
    { id: "criminal", name: language === "es" ? "Criminal" : "Criminal" },
  ], [language]);

  // Memoized filtered forms with optimized search logic
  const filteredForms = useMemo(() => {
    console.log("Filtering forms:", { forms, debouncedSearchTerm, categoryFilter });
    
    if (!forms) {
      console.log("No forms data available");
      return [];
    }
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    const hasSearchTerm = searchLower.length > 0;
    
    const filtered = forms.filter(form => {
      // Early return if no search term and category matches
      if (!hasSearchTerm) {
        return categoryFilter === "all" || form.category === categoryFilter;
      }
      
      // Optimized search: check code first (most specific), then name, then description
      const matchesSearch = 
        form.code.toLowerCase().includes(searchLower) ||
        form.name.toLowerCase().includes(searchLower) ||
        form.description.toLowerCase().includes(searchLower);
      
      const matchesCategory = categoryFilter === "all" || form.category === categoryFilter;
      
      console.log(`Form ${form.code}: search=${matchesSearch}, category=${matchesCategory}`);
      
      return matchesSearch && matchesCategory;
    });
    
    console.log("Filtered forms result:", filtered);
    return filtered;
  }, [forms, debouncedSearchTerm, categoryFilter]);

  // Memoized search suggestions for better UX
  const searchSuggestions = useMemo(() => {
    if (!forms || debouncedSearchTerm.length < 2) return [];
    
    const suggestions = new Set<string>();
    const searchLower = debouncedSearchTerm.toLowerCase();
    
    forms.forEach(form => {
      if (form.code.toLowerCase().includes(searchLower)) {
        suggestions.add(form.code);
      }
      if (form.name.toLowerCase().includes(searchLower)) {
        suggestions.add(form.name);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [forms, debouncedSearchTerm]);

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

  // Optimized form selection handler
  const handleFormSelect = useCallback((form: PetitionForm) => {
    onFormSelect(form);
    setSearchTerm(""); // Clear search after selection
  }, [onFormSelect]);

  // Optimized category filter handler
  const handleCategoryFilter = useCallback((categoryId: string) => {
    setCategoryFilter(categoryId);
    // Clear search when changing categories for better UX
    if (searchTerm) {
      setSearchTerm("");
    }
  }, [searchTerm]);

  const translations = {
    en: {
      title: "Select Your Legal Petition Form",
      filterLabel: "Filter by Category:",
      selectLabel: "Search and Select Your Petition Form:",
      selectPlaceholder: "Start typing to search forms (e.g., FL-100, divorce, probate)...",
      selectedTitle: "Selected Form Information",
      estimatedTime: "Est. completion:",
      requiredDocs: "Required documents:",
      continueButton: "Continue to Document Upload",
      noResults: "No forms match",
      suggestions: "Try searching for:",
      mockDataNotice: "Using demo data - forms will work offline",
    },
    es: {
      title: "Seleccione Su Formulario de Petición Legal",
      filterLabel: "Filtrar por Categoría:",
      selectLabel: "Busque y Seleccione Su Formulario de Petición:",
      selectPlaceholder: "Comience a escribir para buscar formularios (ej. FL-100, divorcio, testamentos)...",
      selectedTitle: "Información del Formulario Seleccionado",
      estimatedTime: "Tiempo estimado:",
      requiredDocs: "Documentos requeridos:",
      continueButton: "Continuar a Cargar Documentos",
      noResults: "No hay formularios que coincidan con",
      suggestions: "Intente buscar:",
      mockDataNotice: "Usando datos de demostración - formularios funcionan sin conexión",
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
        
        {/* Mock Data Notice */}
        {isUsingMockData && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <i className="fas fa-info-circle mr-2"></i>
              {t.mockDataNotice}
            </p>
          </div>
        )}
        
        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium legal-gray mb-2">{t.filterLabel}</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={categoryFilter === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category.id)}
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
            {debouncedSearchTerm && !selectedForm && (
              <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                {filteredForms.length > 0 ? (
                  filteredForms.slice(0, 8).map(form => (
                    <button
                      key={form.code}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-blue-50"
                      onClick={() => handleFormSelect(form)}
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
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    <p>{t.noResults} "{debouncedSearchTerm}"</p>
                    {searchSuggestions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400">{t.suggestions}</p>
                        <div className="flex flex-wrap gap-1 mt-1 justify-center">
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => setSearchTerm(suggestion)}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
