"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";
import Button from "@/components/uiKit/Button";
import { getContactData } from "@/services/api";
import { ContactFormData } from "@/services/notifications";

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
  const [formData, setFormData] = useState<ContactFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success?: boolean;
    message?: string;
  }>({ submitted: false });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const data = await getContactData();
        setContactData(data);
        
        // Initialize form data with empty values based on field names
        if (data?.formSection?.formFields) {
          const initialFormData: ContactFormData = {};
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setFormStatus({
          submitted: true,
          success: true,
          message: contactData?.formSection?.successMessage || 'Ваше сообщение отправлено!'
        });
        
        // Reset form after delay
        setTimeout(() => {
          const initialFormData: ContactFormData = {};
          if (contactData?.formSection?.formFields) {
            contactData.formSection.formFields.forEach((field: FormField) => {
              initialFormData[field.fieldName] = "";
            });
          }
          setFormData(initialFormData);
          setFormStatus({ submitted: false });
        }, 5000);
      } else {
        setFormStatus({
          submitted: true,
          success: false,
          message: result.message || 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'
        });
        
        // Hide error message after delay
        setTimeout(() => {
          setFormStatus({ submitted: false });
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'
      });
      
      // Hide error message after delay
      setTimeout(() => {
        setFormStatus({ submitted: false });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Status message */}
          {formStatus.submitted && formStatus.message && (
            <div 
              className={`mb-6 p-4 rounded ${
                formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {formStatus.message}
            </div>
          )}

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
                      className="w-full h-full px-5 outline-none font-[Roboto_Condensed] text-[16px] disabled:bg-gray-100"
                      required={field.required}
                      disabled={isSubmitting}
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
                    className="w-full h-full p-5 outline-none resize-none font-[Roboto_Condensed] text-[16px] disabled:bg-gray-100"
                    required={field.required}
                    disabled={isSubmitting}
                  />
                </div>
              ))}

            <Button
              label={isSubmitting ? "Отправка..." : submitButtonText}
              onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
              variant="primary"
              className="font-[Roboto_Condensed] font-semibold w-[150px]"
              disabled={isSubmitting}
            />
          </form>
        </div>
      </Container>
    </div>
  );
};

export default ContactForm;
