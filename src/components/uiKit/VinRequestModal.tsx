import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { VinRequestData } from "@/services/notifications";

interface VinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VinRequestModal: React.FC<VinRequestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<VinRequestData>({
    name: "",
    phone: "",
    email: "",
    vin: "",
    model: "",
    parts: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Add/remove body scroll lock when modal opens/closes
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Handle escape key to close modal
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({});
    
    try {
      const response = await fetch('/api/vin-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitStatus({ 
          success: true, 
          message: 'Ваш запрос успешно отправлен! Мы свяжемся с вами в ближайшее время.' 
        });
        
        // Reset form on success
        setFormData({
          name: "",
          phone: "",
          email: "",
          vin: "",
          model: "",
          parts: "",
        });
        
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus({});
        }, 3000);
      } else {
        setSubmitStatus({ 
          success: false, 
          message: result.message || 'Произошла ошибка при отправке запроса. Пожалуйста, попробуйте еще раз.' 
        });
      }
    } catch (error) {
      console.error('Error submitting VIN request:', error);
      setSubmitStatus({ 
        success: false, 
        message: 'Произошла ошибка при отправке запроса. Пожалуйста, попробуйте еще раз.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Handle backdrop click (only close if clicking directly on the backdrop)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-xs"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="flex relative flex-col p-8 md:p-16 bg-white max-w-[480px] w-full mx-4 animate-fadeIn"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold leading-none text-black roboto-condensed-bold">
          Запросить по VIN
        </h2>
        
        {/* Status message */}
        {submitStatus.message && (
          <div 
            className={`mt-4 p-3 rounded ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {submitStatus.message}
          </div>
        )}
        
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="flex z-0 flex-col mt-8 w-full"
        >
          <div className="flex flex-col w-full text-base leading-snug">
            <input
              type="text"
              name="name"
              placeholder="ФИО"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="gap-2.5 self-stretch px-5 py-2.5 w-full border border-solid border-zinc-400 min-h-[42px] focus:outline-none focus:border-[#38AE34] disabled:bg-gray-100 disabled:text-gray-500"
            />
            
            <input
              type="tel"
              name="phone"
              placeholder="Номер телефона"
              value={formData.phone}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="gap-2.5 self-stretch px-5 py-2.5 mt-5 w-full border border-solid border-zinc-400 min-h-[42px] focus:outline-none focus:border-[#38AE34] disabled:bg-gray-100 disabled:text-gray-500"
            />
            
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="gap-2.5 self-stretch px-5 py-2.5 mt-5 w-full border border-solid border-zinc-400 min-h-[42px] focus:outline-none focus:border-[#38AE34] disabled:bg-gray-100 disabled:text-gray-500"
            />
            
            <input
              type="text"
              name="vin"
              placeholder="VIN"
              value={formData.vin}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="gap-2.5 self-stretch px-5 py-2.5 mt-5 w-full border border-solid border-zinc-400 min-h-[42px] focus:outline-none focus:border-[#38AE34] disabled:bg-gray-100 disabled:text-gray-500"
            />
            
            <input
              type="text"
              name="model"
              placeholder="Марка/Модель"
              value={formData.model}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="gap-2.5 self-stretch px-5 py-2.5 mt-5 w-full border border-solid border-zinc-400 min-h-[42px] focus:outline-none focus:border-[#38AE34] disabled:bg-gray-100 disabled:text-gray-500"
            />
            
            <textarea
              name="parts"
              placeholder="Список интересующих запчастей"
              value={formData.parts}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="gap-2.5 px-5 py-2.5 mt-5 w-full border border-solid border-zinc-400 min-h-[112px] resize-none focus:outline-none focus:border-[#38AE34] disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
          
          <Button
            variant="primary"
            className="max-w-[141px] w-full mt-4"
            label={isSubmitting ? "Отправка..." : "Отправить"}
            disabled={isSubmitting}
            onClick={() => formRef.current?.requestSubmit()}
          />
        </form>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 md:right-8 md:top-8 focus:outline-none" 
          aria-label="Close"
          disabled={isSubmitting}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 1L1 19" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            <path d="M1 1L19 19" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VinRequestModal; 