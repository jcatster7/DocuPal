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
                <li><Link href="/library?category=family" className="hover:legal-blue transition-colors">Family Law</Link></li>
                <li><Link href="/library?category=probate" className="hover:legal-blue transition-colors">Probate</Link></li>
                <li><Link href="/library?category=civil" className="hover:legal-blue transition-colors">Civil</Link></li>
                <li><Link href="/library?category=criminal" className="hover:legal-blue transition-colors">Criminal</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold legal-gray mb-3">Resources</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="/resources/filing-instructions" className="hover:legal-blue transition-colors">Filing Instructions</a></li>
                <li><a href="/resources/court-locations" className="hover:legal-blue transition-colors">Court Locations</a></li>
                <li><a href="/resources/fee-information" className="hover:legal-blue transition-colors">Fee Information</a></li>
                <li><a href="/resources/legal-aid" className="hover:legal-blue transition-colors">Legal Aid</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold legal-gray mb-3">Support</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="/support/help-center" className="hover:legal-blue transition-colors">Help Center</a></li>
                <li><a href="/support/contact" className="hover:legal-blue transition-colors">Contact Us</a></li>
                <li><a href="/support/privacy" className="hover:legal-blue transition-colors">Privacy Policy</a></li>
                <li><a href="/support/terms" className="hover:legal-blue transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold legal-gray mb-3">About</h3>
              <p className="text-sm text-gray-600 mb-3">
                Empowering Californians with accessible legal document preparation. Our platform streamlines the process of filing court documents while maintaining accuracy and compliance with California judicial standards.
              </p>
              <p className="text-xs text-gray-500">© 2024 CA Legal Forms. All rights reserved.</p>
            </div>
          </div>
          
          {/* Additional Footer Links */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="grid md:grid-cols-6 gap-4 text-xs text-gray-500">
              <a href="/forms/divorce" className="hover:legal-blue transition-colors">Divorce Forms</a>
              <a href="/forms/custody" className="hover:legal-blue transition-colors">Custody Forms</a>
              <a href="/forms/probate" className="hover:legal-blue transition-colors">Probate Forms</a>
              <a href="/forms/small-claims" className="hover:legal-blue transition-colors">Small Claims</a>
              <a href="/forms/expungement" className="hover:legal-blue transition-colors">Expungement</a>
              <a href="/forms/guardianship" className="hover:legal-blue transition-colors">Guardianship</a>
              <a href="/forms/restraining-order" className="hover:legal-blue transition-colors">Restraining Orders</a>
              <a href="/forms/name-change" className="hover:legal-blue transition-colors">Name Change</a>
              <a href="/forms/adoption" className="hover:legal-blue transition-colors">Adoption</a>
              <a href="/forms/estate-planning" className="hover:legal-blue transition-colors">Estate Planning</a>
              <a href="/forms/landlord-tenant" className="hover:legal-blue transition-colors">Landlord Tenant</a>
              <a href="/forms/employment" className="hover:legal-blue transition-colors">Employment</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
