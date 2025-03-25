"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DropdownItemProps {
  item: string;
  isSelected: boolean;
  onClick: () => void;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  item,
  isSelected,
  onClick,
}) => {
  return (
    <li
      className={`px-5 py-2 cursor-pointer font-['Roboto_Condensed'] text-base ${
        isSelected ? "text-[#38AE34]" : "text-[#3B3B3B]"
      }`}
      onClick={onClick}
      role="option"
      aria-selected={isSelected}
    >
      {item}
    </li>
  );
};

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
  isActive?: boolean;
}

const Select = ({
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
  className = "",
  isActive = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected option label
  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder;

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div
        className={`relative w-full h-[42px] border hover:border-[#38AE34] ${
          isOpen || isActive ? "border-[#38AE34]" : "border-[#8898A4]"
        } rounded-none cursor-pointer ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <button
          className="w-full h-full px-5 text-left text-base bg-white flex justify-between items-center"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span
            className={`font-['Roboto_Condensed'] text-base ${
              value ? "text-[#3B3B3B]" : "text-[#8898A4]"
            }`}
          >
            {selectedLabel}
          </span>
          <svg
            className={`w-4 h-4 transition-transform text-[#8898A4] ${
              isOpen ? "rotate-180" : ""
            }`}
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 left-[-1px] right-[-1px] bg-white border border-[#38AE34] shadow-sm max-h-60 overflow-auto"
            >
              <ul className="py-0" role="listbox">
                {options.map((option) => (
                  <DropdownItem
                    key={option.value}
                    item={option.label}
                    isSelected={option.value === value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Select;
