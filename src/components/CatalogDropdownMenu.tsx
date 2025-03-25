import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Icons for categories (these should be replaced with actual SVGs)
import { IconAuto } from "../assets/icons";

// Category data
const catalogCategories = [
  {
    id: 1,
    name: "Аккумуляторы",
    slug: "batteries",
    icon: <IconAuto />,
  },
  {
    id: 2,
    name: "Кузовные элементы",
    slug: "body-parts",
    icon: <IconAuto />,
  },
  {
    id: 3,
    name: "Автомобильные диски и шины",
    slug: "wheels-tires",
    icon: <IconAuto />,
  },
  {
    id: 4,
    name: "Запасные части для ходовой части",
    slug: "suspension-parts",
    icon: <IconAuto />,
  },
  {
    id: 5,
    name: "Автомобильные аксессуары",
    slug: "accessories",
    icon: <IconAuto />,
  },
];

interface CatalogDropdownMenuProps {
  className?: string;
}

const CatalogDropdownMenu: React.FC<CatalogDropdownMenuProps> = ({
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown function
  const closeDropdown = () => setIsOpen(false);

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
        className="flex gap-2 items-center bg-[#38AE34] text-white h-[42px] px-8 py-3 border border-transparent hover:bg-transparent hover:text-black hover:border-[#38AE34] transition-colors"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg
          width="18"
          height="12"
          viewBox="0 0 18 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0H18V2H0V0ZM0 5H18V7H0V5ZM0 10H18V12H0V10Z"
            fill="currentColor"
          />
        </svg>
        Каталог
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full bg-white shadow-lg z-50 min-w-[296px] py-2">
          {catalogCategories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog/${category.slug}`}
              className="flex items-center gap-5 py-3 px-6 hover:bg-[#F5F5F5] last:border-b-0 focus:text-[#38AE34]"
              onClick={closeDropdown}
            >
              <div className="w-9 h-9 flex items-center justify-center">
                {category.icon}
              </div>
              <span className="font-[Roboto_Condensed] text-base font-medium">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CatalogDropdownMenu;
