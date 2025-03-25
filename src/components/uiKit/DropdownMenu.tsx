import React, { useState, useRef, useEffect } from "react";
import DropdownMenuItem from "./DropdownMenuItem";

interface MenuItem {
  text: string;
  href: string;
}

interface DropdownMenuProps {
  title: string;
  items: MenuItem[];
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  title,
  items,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        className="flex gap-1.5 items-center text-sm font-bold leading-relaxed uppercase text-[#555555] hover:text-[#38AE34] transition-colors roboto-condensed-bold"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {title}
        <svg
          width="10"
          height="5"
          viewBox="0 0 10 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path d="M0 0L5 5L10 0H0Z" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 flex flex-col bg-white shadow-lg min-w-[220px] py-2 z-50">
          {items.map((item, index) => (
            <DropdownMenuItem key={index} text={item.text} href={item.href} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
