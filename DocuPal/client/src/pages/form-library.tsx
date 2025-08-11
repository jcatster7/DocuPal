import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FormPicker from "@/components/form-picker"; // ✅ NEW IMPORT
import type { PetitionForm } from "@shared/schema";

export default function FormLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: forms, isLoading } = useQuery<PetitionForm[]>({
    queryKey: ["/api/petition-forms"],
  });

  const categories = [
    { id: "all", name: "All Forms", color: "bg-legal-blue" },
    { id: "family", name: "Family Law", color: "bg-legal-green" },
    { id: "probate", name: "Probate", color: "bg-legal-purple" },
    { id: "civil", name: "Civil", color: "bg-legal-gray" },
    { id: "criminal", name: "Criminal", color: "bg-legal-red" },
  ];

  const filteredForms = forms?.filter(form => {
    const matchesSearch = !searchTerm || 
      form.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || form.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-legal-light">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg border p-6">
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-legal-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-book text-2xl legal-blue"></i>
              <h1 className="text-xl font-semibold legal-gray">California Legal Forms Library</h1>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Form Filler
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="mb-4">
            <div className="relative">
              {/* ✅ Replaced <Input> with FormPicker */}
              <FormPicker onSelect={(code) => setSearchTerm(code)} />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? category.color : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map(form => (
            <Card key={form.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant="outline" 
                      className={`${getCategoryColor(form.category)} text-white`}
                    >
                      {form.category.charAt(0).toUpperCase() + form.category.slice(1)}
                    </Badge>
                    <span className="text-sm font-mono legal-gray">{form.code}</span>
                  </div>
                  <h3 className="font-semibold legal-gray mb-2">{form.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{form.description}</p>
                </div>
                
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <i className="fas fa-clock mr-2 w-4"></i>
                    Est. time: {form.estimatedTime || "15-30 minutes"}
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-file mr-2 w-4"></i>
                    Required docs: {form.requiredDocuments?.join(", ") || "Varies"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/?form=${form.code}`} className="flex-1">
                    <Button className="w-full bg-legal-blue hover:bg-opacity-90 text-white">
                      <i className="fas fa-edit mr-2"></i>
                      Fill Form
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://www.courts.ca.gov/documents/${form.code.toLowerCase()}.pdf`, "_blank")}
                  >
                    <i className="fas fa-download"></i>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors = {
    family: "bg-legal-green",
    probate: "bg-legal-purple", 
    civil: "bg-legal-gray",
    criminal: "bg-legal-red"
  };
  return colors[category as keyof typeof colors] || "bg-legal-blue";
}
