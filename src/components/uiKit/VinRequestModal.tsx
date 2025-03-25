import React, { useState, useRef, useEffect } from "react";
import Button from "./Button";

interface VinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VinRequestModal: React.FC<VinRequestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    vin: "",
    model: "",
    parts: "",
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add/remove body scroll lock when modal opens/closes
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Handle click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
    // Reset form and close modal on success
    setFormData({
      name: "",
      phone: "",
      email: "",
      vin: "",
      model: "",
      parts: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center  bg-black/20 backdrop-blur-xs">
      <div 
        ref={modalRef}
        className="flex relative flex-col p-8 md:p-16 bg-white max-w-[480px] w-full mx-4 animate-fadeIn"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold leading-none text-black roboto-condensed-bold">
          Запрос по VIN
        </h2>
        
        <form onSubmit={handleSubmit} className="flex z-0 flex-col mt-8 w-full">
          <div className="flex flex-col w-full text-base leading-snug">
            <input
              type="text"
              name="name"
              placeholder="ФИО"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="gap-2.5 self-stretch px-5 py-2.5 w-full border border-solid border-zinc-400 min-h-[42px] focus:outline-none focus:border-[#38AE34]"
            />
            
            <input
              type="tel"
              name="phone"
              placeholder="Номер телефона"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="gap-2.5 self-stretch px-5 py-2.5 mt-5 w-full border border-solid border-zinc-400 min-h-[42px] focus:outline-none focus:border-[#38AE34]"
            />
            
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="gap-2.5 self-stretch px-5 py-2.5 mt-5 w-full border border-solid border-zinc-400 min-h-[42px] focus:outline-none focus:border-[#38AE34]"
            />
            
            <input
              type="text"
              name="vin"
              placeholder="VIN"
              value={formData.vin}
              onChange={handleInputChange}
              required
              className="gap-2.5 self-stretch px-5 py-2.5 mt-5 w-full border border-solid border-zinc-400 min-h-[42px] focus:outline-none focus:border-[#38AE34]"
            />
            
            <input
              type="text"
              name="model"
              placeholder="Марка/Модель"
              value={formData.model}
              onChange={handleInputChange}
              required
              className="gap-2.5 self-stretch px-5 py-2.5 mt-5 w-full border border-solid border-zinc-400 min-h-[42px] focus:outline-none focus:border-[#38AE34]"
            />
            
            <textarea
              name="parts"
              placeholder="Список интересующих запчастей"
              value={formData.parts}
              onChange={handleInputChange}
              required
              className="gap-2.5 px-5 py-2.5 mt-5 w-full border border-solid border-zinc-400 min-h-[112px] resize-none focus:outline-none focus:border-[#38AE34]"
            />
          </div>
          
          <Button
            variant="primary"
            className="max-w-[141px] w-full mt-4"
            label="Отправить"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
          />
        </form>
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 md:right-8 md:top-8 focus:outline-none" 
          aria-label="Close"
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