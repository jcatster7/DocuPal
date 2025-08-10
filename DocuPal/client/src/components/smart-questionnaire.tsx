import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import type { PetitionForm, UserProfile } from "@shared/schema";

interface SmartQuestionnaireProps {
  selectedForm: PetitionForm | null;
  uploadedFiles: Array<any>;
  formData: Record<string, any>;
  userProfile: UserProfile | null | undefined;
  onFormDataUpdate: (data: Record<string, any>) => void;
  onNext: () => void;
  onBack: () => void;
  language: string;
  sessionId: string;
}

export default function SmartQuestionnaire({
  selectedForm,
  uploadedFiles,
  formData,
  userProfile,
  onFormDataUpdate,
  onNext,
  onBack,
  language,
  sessionId,
}: SmartQuestionnaireProps) {
  const [localFormData, setLocalFormData] = useState(formData);
  const [hasMinorChildren, setHasMinorChildren] = useState(false);
  const [children, setChildren] = useState<Array<{ name: string; dateOfBirth: string; gender: string }>>([]);

  // Pre-fill form with user profile data
  useEffect(() => {
    if (userProfile?.profileData && Object.keys(localFormData).length === 0) {
      setLocalFormData(userProfile.profileData);
    }
  }, [userProfile, localFormData]);

  const saveProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiRequest("PATCH", `/api/profile/${sessionId}`, {
        profileData,
        language,
      });
      return response.json();
    },
  });

  const translations = {
    en: {
      title: "Complete Form Information",
      autoFillAlert: "Auto-Filled Information Detected",
      autoFillDesc: "We've automatically filled some fields from your uploaded documents. Please review and complete the remaining information.",
      petitionerInfo: "Petitioner Information",
      respondentInfo: "Respondent Information",
      caseInfo: "Case Information",
      minorChildren: "Minor Children",
      fullName: "Full Legal Name",
      dateOfBirth: "Date of Birth",
      address: "Address",
      phoneNumber: "Phone Number",
      emailAddress: "Email Address",
      lastKnownAddress: "Last Known Address",
      dateOfMarriage: "Date of Marriage",
      dateOfSeparation: "Date of Separation",
      countyOfFiling: "County of Filing",
      hasMinorChildrenLabel: "We have minor children together",
      childName: "Child's Name",
      gender: "Gender",
      selectGender: "Select...",
      male: "Male",
      female: "Female",
      addChild: "Add Another Child",
      backButton: "Back to Document Upload",
      continueButton: "Review and Generate Form",
      selectCounty: "Select County...",
    },
    es: {
      title: "Complete la Información del Formulario",
      autoFillAlert: "Información Autocompletada Detectada",
      autoFillDesc: "Hemos completado automáticamente algunos campos de sus documentos cargados. Por favor revise y complete la información restante.",
      petitionerInfo: "Información del Peticionario",
      respondentInfo: "Información del Demandado",
      caseInfo: "Información del Caso",
      minorChildren: "Hijos Menores de Edad",
      fullName: "Nombre Legal Completo",
      dateOfBirth: "Fecha de Nacimiento",
      address: "Dirección",
      phoneNumber: "Número de Teléfono",
      emailAddress: "Dirección de Email",
      lastKnownAddress: "Última Dirección Conocida",
      dateOfMarriage: "Fecha de Matrimonio",
      dateOfSeparation: "Fecha de Separación",
      countyOfFiling: "Condado de Presentación",
      hasMinorChildrenLabel: "Tenemos hijos menores juntos",
      childName: "Nombre del Hijo",
      gender: "Género",
      selectGender: "Seleccionar...",
      male: "Masculino",
      female: "Femenino",
      addChild: "Agregar Otro Hijo",
      backButton: "Volver a Cargar Documentos",
      continueButton: "Revisar y Generar Formulario",
      selectCounty: "Seleccionar Condado...",
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const counties = [
    "Los Angeles", "San Francisco", "Orange", "San Diego", "Riverside", "Sacramento",
    "Alameda", "Santa Clara", "San Bernardino", "Contra Costa", "Fresno", "Kern",
    "Ventura", "San Mateo", "Sonoma", "Stanislaus", "San Joaquin", "Santa Barbara",
    "Solano", "Monterey", "Placer", "San Luis Obispo", "Santa Cruz", "Merced",
    "Butte", "Yolo", "El Dorado", "Imperial", "Shasta", "Kings", "Madera", "Napa"
  ];

  const updateField = (section: string, field: string, value: string) => {
    const newData = {
      ...localFormData,
      [section]: {
        ...localFormData[section],
        [field]: value
      }
    };
    setLocalFormData(newData);
    onFormDataUpdate(newData);
    
    // Save to profile
    saveProfileMutation.mutate(newData);
  };

  const addChild = () => {
    setChildren([...children, { name: "", dateOfBirth: "", gender: "" }]);
  };

  const updateChild = (index: number, field: string, value: string) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setChildren(newChildren);
    
    const newData = { ...localFormData, children: newChildren };
    setLocalFormData(newData);
    onFormDataUpdate(newData);
  };

  const handleNext = () => {
    const finalData = { ...localFormData, hasMinorChildren, children };
    onFormDataUpdate(finalData);
    onNext();
  };

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
        
        {/* Auto-filled Information Alert */}
        {uploadedFiles.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
            <div className="flex items-start space-x-3">
              <i className="fas fa-magic legal-green mt-1"></i>
              <div>
                <h3 className="font-medium legal-green mb-1">{t.autoFillAlert}</h3>
                <p className="text-sm legal-gray">{t.autoFillDesc}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Petitioner Information */}
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium legal-gray mb-4 flex items-center">
              <i className="fas fa-user mr-2 legal-blue"></i>
              {t.petitionerInfo}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium legal-gray mb-1">{t.fullName}</label>
                <Input
                  placeholder="First Middle Last"
                  value={localFormData.petitioner?.fullName || ""}
                  onChange={(e) => updateField("petitioner", "fullName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium legal-gray mb-1">{t.dateOfBirth}</label>
                <Input
                  type="date"
                  value={localFormData.petitioner?.dateOfBirth || ""}
                  onChange={(e) => updateField("petitioner", "dateOfBirth", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium legal-gray mb-1">{t.address}</label>
                <Input
                  placeholder="Street, City, State, ZIP"
                  value={localFormData.petitioner?.address || ""}
                  onChange={(e) => updateField("petitioner", "address", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium legal-gray mb-1">{t.phoneNumber}</label>
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={localFormData.petitioner?.phone || ""}
                  onChange={(e) => updateField("petitioner", "phone", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium legal-gray mb-1">{t.emailAddress}</label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={localFormData.petitioner?.email || ""}
                  onChange={(e) => updateField("petitioner", "email", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Respondent Information */}
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-medium legal-gray mb-4 flex items-center">
              <i className="fas fa-users mr-2 legal-blue"></i>
              {t.respondentInfo}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium legal-gray mb-1">{t.fullName}</label>
                <Input
                  placeholder="First Middle Last"
                  value={localFormData.respondent?.fullName || ""}
                  onChange={(e) => updateField("respondent", "fullName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium legal-gray mb-1">{t.dateOfBirth}</label>
                <Input
                  type="date"
                  value={localFormData.respondent?.dateOfBirth || ""}
                  onChange={(e) => updateField("respondent", "dateOfBirth", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium legal-gray mb-1">{t.lastKnownAddress}</label>
                <Input
                  placeholder="Street, City, State, ZIP"
                  value={localFormData.respondent?.address || ""}
                  onChange={(e) => updateField("respondent", "address", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Case Information */}
          {selectedForm.category === "family" && (
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-medium legal-gray mb-4 flex items-center">
                <i className="fas fa-calendar mr-2 legal-blue"></i>
                {t.caseInfo}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium legal-gray mb-1">{t.dateOfMarriage}</label>
                  <Input
                    type="date"
                    value={localFormData.case?.marriageDate || ""}
                    onChange={(e) => updateField("case", "marriageDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium legal-gray mb-1">{t.dateOfSeparation}</label>
                  <Input
                    type="date"
                    value={localFormData.case?.separationDate || ""}
                    onChange={(e) => updateField("case", "separationDate", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium legal-gray mb-1">{t.countyOfFiling}</label>
                  <Select
                    value={localFormData.case?.county || ""}
                    onValueChange={(value) => updateField("case", "county", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectCounty} />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map(county => (
                        <SelectItem key={county} value={county.toLowerCase().replace(" ", "-")}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Minor Children */}
          {selectedForm.category === "family" && (
            <div className="border border-gray-200 rounded p-4">
              <h3 className="font-medium legal-gray mb-4 flex items-center">
                <i className="fas fa-child mr-2 legal-blue"></i>
                {t.minorChildren}
              </h3>
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasMinorChildren"
                    checked={hasMinorChildren}
                    onCheckedChange={(checked) => setHasMinorChildren(checked === true)}
                  />
                  <label htmlFor="hasMinorChildren" className="text-sm">
                    {t.hasMinorChildrenLabel}
                  </label>
                </div>
              </div>
              {hasMinorChildren && (
                <div className="space-y-4">
                  {children.map((child, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium legal-gray mb-1">{t.childName}</label>
                          <Input
                            value={child.name}
                            onChange={(e) => updateChild(index, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium legal-gray mb-1">{t.dateOfBirth}</label>
                          <Input
                            type="date"
                            value={child.dateOfBirth}
                            onChange={(e) => updateChild(index, "dateOfBirth", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium legal-gray mb-1">{t.gender}</label>
                          <Select
                            value={child.gender}
                            onValueChange={(value) => updateChild(index, "gender", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t.selectGender} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">{t.male}</SelectItem>
                              <SelectItem value="female">{t.female}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={addChild}
                    className="legal-blue"
                  >
                    <i className="fas fa-plus mr-1"></i>
                    {t.addChild}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            <i className="fas fa-arrow-left mr-2"></i>
            {t.backButton}
          </Button>
          <Button 
            className="bg-legal-blue text-white hover:bg-opacity-90"
            onClick={handleNext}
          >
            {t.continueButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
