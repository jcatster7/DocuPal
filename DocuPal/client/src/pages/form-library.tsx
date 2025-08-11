import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FormPicker from "@/components/form-picker";
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

export default function FormLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Handle category from URL query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && ['family', 'probate', 'civil', 'criminal'].includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  const { data: apiForms, isLoading, error } = useQuery<PetitionForm[]>({
    queryKey: ["/api/petition-forms"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Use mock data if API fails, otherwise use API data
  const forms = apiForms || MOCK_FORMS;
  const isUsingMockData = !apiForms && error;

  // Memoized categories to prevent unnecessary re-renders
  const categories = useMemo(() => [
    { id: "all", name: "All Forms", color: "bg-legal-blue" },
    { id: "family", name: "Family Law", color: "bg-legal-green" },
    { id: "probate", name: "Probate", color: "bg-legal-purple" },
    { id: "civil", name: "Civil", color: "bg-legal-gray" },
    { id: "criminal", name: "Criminal", color: "bg-legal-red" },
  ], []);

  // Memoized filtered forms with optimized search logic
  const filteredForms = useMemo(() => {
    if (!forms) return [];
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    const hasSearchTerm = searchLower.length > 0;
    
    return forms.filter(form => {
      // Early return if no search term and category matches
      if (!hasSearchTerm) {
        return selectedCategory === "all" || form.category === selectedCategory;
      }
      
      // Optimized search: check code first (most specific), then name, then description
      const matchesSearch = 
        form.code.toLowerCase().includes(searchLower) ||
        form.name.toLowerCase().includes(searchLower) ||
        form.description.toLowerCase().includes(searchLower);
      
      const matchesCategory = selectedCategory === "all" || form.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [forms, debouncedSearchTerm, selectedCategory]);

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

  // Optimized category filter handler
  const handleCategoryFilter = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    // Clear search when changing categories for better UX
    if (searchTerm) {
      setSearchTerm("");
    }
  }, [searchTerm]);

  // Optimized search handler
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-legal-gray mb-4">
          California Legal Forms Library
        </h1>
        <p className="text-lg text-legal-gray">
          Browse and select from our comprehensive collection of California Judicial Council forms
        </p>
        
        {/* Mock Data Notice */}
        {isUsingMockData && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <i className="fas fa-info-circle mr-2"></i>
              Using demo data - forms will work offline
            </p>
          </div>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium legal-gray mb-2">Filter by Category:</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category.id)}
                className={selectedCategory === category.id ? category.color : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <label className="block text-sm font-medium legal-gray mb-2">Search Forms:</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by form code, name, or description..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-legal-blue focus:border-transparent"
            />
            <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
          </div>
          
          {/* Search Suggestions */}
          {searchSuggestions.length > 0 && debouncedSearchTerm && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-gray-600 mb-2">Try searching for:</p>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(suggestion)}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-legal-gray">
          {filteredForms.length === 0 
            ? "No forms found" 
            : `Showing ${filteredForms.length} of ${forms?.length || 0} forms`
          }
        </p>
      </div>

      {/* Forms Grid */}
      {filteredForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map(form => (
            <Card key={form.code} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-legal-blue">{form.code}</h3>
                  <Badge 
                    variant="secondary" 
                    className={categories.find(c => c.id === form.category)?.color}
                  >
                    {categories.find(c => c.id === form.category)?.name}
                  </Badge>
                </div>
                
                <h4 className="text-md font-medium text-legal-gray mb-2">{form.name}</h4>
                <p className="text-sm text-legal-gray mb-4 line-clamp-3">{form.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-legal-gray">
                    <i className="fas fa-clock mr-2"></i>
                    <span>Est. completion: {form.estimatedTime}</span>
                  </div>
                  {form.requiredDocuments && form.requiredDocuments.length > 0 && (
                    <div className="flex items-start text-sm text-legal-gray">
                      <i className="fas fa-file mr-2 mt-0.5"></i>
                      <span>Required: {form.requiredDocuments.join(", ")}</span>
                    </div>
                  )}
                </div>
                
                <Link href={`/petition-form?form=${form.code}`}>
                  <Button className="w-full bg-legal-blue hover:bg-opacity-90 text-white">
                    Start This Form
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-search text-6xl"></i>
          </div>
          <h3 className="text-xl font-medium text-legal-gray mb-2">
            No forms match "{debouncedSearchTerm}"
          </h3>
          <p className="text-legal-gray mb-4">
            Try adjusting your search terms or category filter
          </p>
          {searchSuggestions.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(suggestion)}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Picker Component */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-legal-gray mb-6">Quick Form Selection</h2>
        <FormPicker 
          forms={forms || []}
          onSelect={(code) => setSearchTerm(code)} 
        />
      </div>
    </div>
  );
}
