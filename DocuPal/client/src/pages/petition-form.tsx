import { useState, useEffect } from "react";
import PetitionWizard from "@/components/petition-wizard";
import { Link } from "wouter";

export default function PetitionForm() {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    // Generate session ID for anonymous tracking
    if (!localStorage.getItem("sessionId")) {
      localStorage.setItem("sessionId", crypto.randomUUID());
    }
  }, []);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === "en" ? "es" : "en");
  };

  const translations = {
    en: {
      title: "CA Legal Petition Auto-Filler",
      language: "English | Español",
      formLibrary: "Form Library"
    },
    es: {
      title: "Autocompletador de Peticiones Legales de CA",
      language: "Español | English", 
      formLibrary: "Biblioteca de Formularios"
    }
  };

  const t = translations[currentLanguage as keyof typeof translations];

  return (
    <div className="min-h-screen bg-legal-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-gavel text-2xl" style={{ color: "var(--legal-blue)" }}></i>
              <h1 className="text-xl font-semibold legal-gray">{t.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="text-sm legal-gray hover:legal-blue transition-colors"
                onClick={toggleLanguage}
              >
                <i className="fas fa-globe mr-1"></i>
                {t.language}
              </button>
              <Link href="/library">
                <button className="text-sm legal-gray hover:legal-blue transition-colors">
                  <i className="fas fa-book mr-1"></i>
                  {t.formLibrary}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <PetitionWizard language={currentLanguage} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold legal-gray mb-3">Legal Forms</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:legal-blue">Family Law</a></li>
                <li><a href="#" className="hover:legal-blue">Probate</a></li>
                <li><a href="#" className="hover:legal-blue">Civil</a></li>
                <li><a href="#" className="hover:legal-blue">Criminal</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold legal-gray mb-3">Resources</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:legal-blue">Filing Instructions</a></li>
                <li><a href="#" className="hover:legal-blue">Court Locations</a></li>
                <li><a href="#" className="hover:legal-blue">Fee Information</a></li>
                <li><a href="#" className="hover:legal-blue">Legal Aid</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold legal-gray mb-3">Support</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:legal-blue">Help Center</a></li>
                <li><a href="#" className="hover:legal-blue">Contact Us</a></li>
                <li><a href="#" className="hover:legal-blue">Privacy Policy</a></li>
                <li><a href="#" className="hover:legal-blue">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold legal-gray mb-3">About</h3>
              <p className="text-sm text-gray-600 mb-3">Automated legal document preparation for California courts. Not a substitute for legal advice.</p>
              <p className="text-xs text-gray-500">© 2024 CA Legal Forms. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
