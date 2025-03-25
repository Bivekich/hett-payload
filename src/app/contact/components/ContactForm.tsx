"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";
import Button from "@/components/uiKit/Button";
import { getContactData } from "@/services/api";

interface FormField {
  fieldName: string;
  fieldType: "text" | "email" | "tel" | "textarea";
  label: string;
  placeholder: string;
  required: boolean;
  colSpan: number;
  height?: number;
}

// Define a type for the contact data
interface FormSection {
  enabled: boolean;
  title?: string;
  introText?: string;
  emailContact?: string;
  submitButtonText?: string;
  successMessage?: string;
  formFields: FormField[];
}

interface ContactDataType {
  formSection?: FormSection;
  // Add other properties as needed
}

const ContactForm = () => {
  const [contactData, setContactData] = useState<ContactDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const data = await getContactData();
        setContactData(data);
        
        // Initialize form data with empty values based on field names
        if (data?.formSection?.formFields) {
          const initialFormData: Record<string, string> = {};
          data.formSection.formFields.forEach((field: FormField) => {
            initialFormData[field.fieldName] = "";
          });
          setFormData(initialFormData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setError(typeof error === 'string' ? error : 'Failed to load contact form');
        setLoading(false);
      }
    };
    
    fetchContactData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // Here you would typically send the data to your backend
    
    // Show success message
    setFormSubmitted(true);
    
    // Reset form after delay
    setTimeout(() => {
      const initialFormData: Record<string, string> = {};
      if (contactData?.formSection?.formFields) {
        contactData.formSection.formFields.forEach((field: FormField) => {
          initialFormData[field.fieldName] = "";
        });
      }
      setFormData(initialFormData);
      setFormSubmitted(false);
    }, 3000);
  };
  
  // Handle loading state
  if (loading) {
    return (
      <div className="bg-white py-12">
        <Container>
          <div className="text-center">Loading contact form...</div>
        </Container>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="bg-white py-12">
        <Container>
          <div className="text-center text-red-500">{error}</div>
        </Container>
      </div>
    );
  }
  
  // If form section is disabled or no contact data
  if (!contactData || !contactData.formSection?.enabled) {
    return null;
  }
  
  // Get the form configuration
  const formConfig = contactData.formSection;
  const formFields = formConfig.formFields || [];
  const title = formConfig.title || "Обратная связь";
  const introText = formConfig.introText || "";
  const emailContact = formConfig.emailContact || "";
  const submitButtonText = formConfig.submitButtonText || "Отправить";
  const successMessage = formConfig.successMessage || "Ваше сообщение отправлено!";

  return (
    <div className="bg-white py-12">
      <Container>
        <div className="mx-auto">
          <h2 className="text-[28px] font-extrabold font-[Roboto_Condensed] text-black mb-6">
            {title}
          </h2>

          {introText && (
            <p className="text-[16px] font-normal font-[Roboto_Condensed] text-[#181818] mb-2">
              {introText}
            </p>
          )}
          
          {emailContact && (
            <p className="text-[16px] font-normal font-[Roboto_Condensed] text-[#38AE34] mb-6">
              {emailContact}
            </p>
          )}

          {formSubmitted ? (
            <div className="py-8 text-center text-[#38AE34] text-xl font-medium">
              {successMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {formFields.map((field: FormField) => {
                  // Skip textarea fields as they're rendered separately
                  if (field.fieldType === "textarea") return null;
                  
                  return (
                    <div 
                      key={field.fieldName}
                      className={`border border-[#B2B2B2] focus-within:border-[#38AE34] transition-colors h-[42px] ${
                        field.colSpan > 1 ? `md:col-span-${field.colSpan}` : ""
                      }`}
                    >
                      <input
                        type={field.fieldType}
                        name={field.fieldName}
                        value={formData[field.fieldName] || ""}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className="w-full h-full px-5 outline-none font-[Roboto_Condensed] text-[16px]"
                        required={field.required}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Textarea Fields */}
              {formFields
                .filter((field: FormField) => field.fieldType === "textarea")
                .map((field: FormField) => (
                  <div 
                    key={field.fieldName}
                    className={`border border-[#B2B2B2] focus-within:border-[#38AE34] transition-colors h-[${field.height || 150}px] mb-6 ${
                      field.colSpan > 1 ? `md:col-span-${field.colSpan}` : ""
                    }`}
                  >
                    <textarea
                      name={field.fieldName}
                      value={formData[field.fieldName] || ""}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full h-full p-5 outline-none resize-none font-[Roboto_Condensed] text-[16px]"
                      required={field.required}
                    />
                  </div>
                ))}

              <Button
                label={submitButtonText}
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                variant="primary"
                className="font-[Roboto_Condensed] font-semibold w-[150px]"
              />
            </form>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ContactForm;
