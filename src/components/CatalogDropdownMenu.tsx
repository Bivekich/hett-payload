import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from '../services/catalogApi';
import { Category } from '../types/catalog';
import { API_URL } from '@/services/api';

interface CatalogDropdownMenuProps {
  className?: string;
}

const CatalogDropdownMenu: React.FC<CatalogDropdownMenuProps> = ({
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown function
  const closeDropdown = () => setIsOpen(false);

  // Helper function to chunk the categories array into groups of 4
  const chunkCategories = (cats: Category[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < cats.length; i += size) {
      chunkedArr.push(cats.slice(i, i + size));
    }
    return chunkedArr;
  };

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.docs);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  // Generate category element with consistent styling
  const renderCategoryItem = (category: Category) => {
    // Handle icon/image using similar approach as ProductSearchSection
    let iconSrc = '/images/default_category_icon.svg';
    
    // First try to use the icon if available
    if (category.icon && category.icon.url) {
      iconSrc = category.icon.url;
      
      // Make URL absolute if it's relative
      if (iconSrc.startsWith('/')) {
        iconSrc = `${API_URL}${iconSrc}`;
      }
    } 
    // Fallback to the category image if icon is not available
    else if (category.image && category.image.url) {
      iconSrc = category.image.url;
      
      // Make URL absolute if it's relative
      if (iconSrc.startsWith('/')) {
        iconSrc = `${API_URL}${iconSrc}`;
      }
    }

    return (
      <Link
        key={category.id} 
        href={`/catalog?category=${category.slug}`}
        className="flex group items-center gap-5 py-3 px-6 focus:text-[#38AE34]"
        onClick={closeDropdown}
      >
        <div className="w-9 h-9 flex items-center justify-center">
          <Image 
            src={iconSrc}
            alt={category.name}
            width={36}
            height={36}
            className="object-contain"
            unoptimized
          />
        </div>
        <span className="font-[Roboto_Condensed] group-hover:text-[#38AE34] text-[14px] font-medium">
          {category.name}
        </span>
      </Link>
    );
  };

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
        <div 
          className={`absolute left-0 top-full bg-white shadow-lg z-50 py-2 flex flex-row ${
            categories.length > 4 ? 'min-w-[592px]' : 'min-w-[296px]'
          }`}
        >
          {isLoading ? (
            <div className="py-3 px-6 text-center w-full">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#38AE34] mx-auto"></div>
            </div>
          ) : categories.length > 0 ? (
            // Split categories into columns with 4 categories each
            chunkCategories(categories, 4).map((chunk, columnIndex) => (
              <div key={columnIndex} className="flex flex-col min-w-[296px] border-r border-gray-100 last:border-r-0">
                {chunk.map(category => renderCategoryItem(category))}
              </div>
            ))
          ) : (
            <div className="py-3 px-6 text-center text-gray-500 w-full">
              Нет доступных категорий
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogDropdownMenu;
