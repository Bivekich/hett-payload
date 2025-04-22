"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/HettLogo.svg";
import Button from "./uiKit/Button";
import TelegramIcon from "../assets/icons/tgIcon.svg";
import WhatsAppIcon from "../assets/icons/whatsappIcon.svg";
import DropdownMenu from "./uiKit/DropdownMenu";
import React from "react";
import CatalogDropdownMenu from "./CatalogDropdownMenu";
import VinRequestModal from "./uiKit/VinRequestModal";
import { getCustomPages, getSettings } from "@/services/api";
import { getCategories } from "@/services/catalogApi";
import { Category } from "@/types/catalog";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/services/api";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  customPages: { id: number; title: string; slug: string }[];
  categories: Category[];
}

interface FooterData {
  headerPhone?: string;
  telegramLink?: string;
  whatsappLink?: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon?: {
    url: string;
    alt?: string;
  };
  title?: string;
}

interface SiteSettings {
  header?: {
    phone?: string;
    socialLinks?: SocialLink[];
  };
  footer?: {
    phone?: string;
    phoneLabel?: string;
    email?: string;
    emailLabel?: string;
    address?: string;
    addressLabel?: string;
    socialLinks?: SocialLink[];
    legalDocuments?: {
      copyright?: string;
      termsOfUse?: {
        label?: string;
        url?: string;
      };
      privacyPolicy?: {
        label?: string;
        url?: string;
      };
      additionalLinks?: Array<{
        label: string;
        url: string;
      }>;
    };
  };
}

function MobileMenu({
  isOpen,
  onClose,
  customPages,
  categories,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleNavigation = () => {
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className={`
        fixed left-0 right-0 bg-white 
        transform transition-all duration-300 ease-in-out
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        top-[140px]
        md:hidden
        z-40
        h-auto
        max-h-[calc(100vh-140px)]
        overflow-y-auto
        shadow-lg
      `}
    >
      <nav className="flex flex-col p-5 pb-30">
        <Link
          href="/about"
          className="pb-4 text-[#555555] hover:text-[#38AE34] transition-colors text-[16px] font-bold uppercase roboto-condensed-bold"
          onClick={() => handleNavigation()}
        >
          О КОМПАНИИ HETT AUTOMOTIVE
        </Link>
        {customPages.map((page) => (
          <Link
            key={page.id}
            href={`/pages/${page.slug}/${page.id}`}
            className="pb-4 text-[#555555] hover:text-[#38AE34] transition-colors text-[16px] font-bold uppercase roboto-condensed-bold"
            onClick={() => handleNavigation()}
          >
            {page.title}
          </Link>
        ))}

        <Link
          href="/news"
          className="pb-4 text-[#555555] hover:text-[#38AE34] transition-colors text-[16px] font-bold uppercase roboto-condensed-bold"
          onClick={() => handleNavigation()}
        >
          НОВОСТИ
        </Link>

        <Link
          href="/contact"
          className="pb-4 text-[#555555] hover:text-[#38AE34] transition-colors text-[16px] font-bold uppercase roboto-condensed-bold"
          onClick={() => handleNavigation()}
        >
          КОНТАКТЫ
        </Link>

       
      </nav>

      {/* Contact info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-row w-full justify-between">
        <a
          href="tel:+74952602060"
          className="block text-[#555555] text-[18px] font-bold roboto-condensed-bold mb-4"
        >
          +7 (495) 260 20 60
        </a>
        <div className="flex gap-4">
          <a
            href="https://t.me/hettautomotive"
            target="_blank"
            rel="noopener noreferrer"
            className="transform hover:scale-[1.1] transition-all"
          >
            <div className="w-5 aspect-square">
              <Image
                src={TelegramIcon}
                alt="Telegram"
                className="w-full h-full transition-all"
              />
            </div>
          </a>
          <a
            href="https://wa.me/74952602060"
            target="_blank"
            rel="noopener noreferrer"
            className="transform hover:scale-[1.1] transition-all"
          >
            <div className="w-5 aspect-square">
              <Image
                src={WhatsAppIcon}
                alt="WhatsApp"
                className="w-full h-full transition-all"
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCatalogOpen, setIsMobileCatalogOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [isVinModalOpen, setIsVinModalOpen] = useState(false);
  const [customPages, setCustomPages] = useState<
    { id: number; title: string; slug: string }[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Effect to sync searchQuery state with URL search param
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search");
    setSearchQuery(urlSearchQuery || "");
  }, [searchParams]);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        setSettings(settings);

        // For backward compatibility, also set footerData
        if (settings?.header) {
          setFooterData({
            headerPhone: settings.header.phone,
            telegramLink: settings.header.socialLinks?.find(
              (link) => link.platform === "telegram"
            )?.url,
            whatsappLink: settings.header.socialLinks?.find(
              (link) => link.platform === "whatsapp"
            )?.url,
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  // Fetch custom pages
  useEffect(() => {
    const fetchCustomPages = async () => {
      try {
        const pages = await getCustomPages(1, 10, true);
        setCustomPages(pages);
      } catch (err) {
        console.error("Error fetching custom pages:", err);
      }
    };

    fetchCustomPages();
  }, []);

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.docs);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Simplify search input change handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle search submission - UPDATED
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      // Get current parameters from the URL
      const currentParams = new URLSearchParams(searchParams.toString());
      // Set/update the search parameter
      currentParams.set("search", searchQuery.trim());
      // Build the final query string
      const queryString = currentParams.toString();
      // Navigate with combined parameters
      router.push(`/catalog?${queryString}`);
    } else {
      // Optional: Handle case where search is empty but user clicks search
      // Maybe remove the search param if it exists?
      const currentParams = new URLSearchParams(searchParams.toString());
      if (currentParams.has("search")) {
        currentParams.delete("search");
        const queryString = currentParams.toString();
        router.push(`/catalog${queryString ? "?" + queryString : ""}`);
      }
      // Or just do nothing if search is empty
    }
  };

  // Handle keyboard events in the search input (for Enter key)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  return (
    <header
      ref={headerRef}
      className={`w-full bg-white fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${
        isScrolled ? "md:h-[140px] lg:h-[100px]" : "md:h-[200px] lg:h-[160px]"
      } ${
        isMobileSearchOpen ? "h-[200px] bg-white" : "h-[140px] md:bg-white bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block">
          {/* Top Row */}
          <div className="flex flex-wrap gap-5 justify-between w-full py-5">
            {/* Left Side Group */}
            <div className="flex gap-8 items-center">
              {/* Logo */}
              <Link href="/" className="flex self-stretch relative group">
                <Image
                  src={logo}
                  alt="Логотип Hett Automotive"
                  className="w-full h-full object-contain"
                  width={176}
                  height={42}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
              </Link>

              {/* Catalog Dropdown */}
              <CatalogDropdownMenu />

              {/* Search Icon - Appears when scrolled */}
              <button
                onClick={() => setIsScrolled(false)}
                className={`transition-all duration-300 transform ${
                  isScrolled
                    ? "opacity-100 translate-x-0 pointer-events-auto"
                    : "opacity-0 -translate-x-4 pointer-events-none"
                } hover:text-[#38AE34]`}
                aria-label="Open search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#555555] hover:text-[#38AE34] transition-colors"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </button>

              {/* Navigation Links */}
              <div className="flex items-center">
                <div className="flex gap-8">
                  {customPages.length > 0 ? (
                    <DropdownMenu
                      title="О компании Hett Automotive"
                      items={customPages.map((page) => ({
                        text: page.title,
                        href: `/pages/${page.slug}/${page.id}`,
                      }))}
                    />
                  ) : (
                    <Link
                      href="/about"
                      className="text-sm font-bold leading-relaxed uppercase text-[#555555] hover:text-[#38AE34] transition-colors roboto-condensed-bold"
                    >
                      О компании Hett Automotive
                    </Link>
                  )}
                  <div className="flex gap-8 text-sm font-bold leading-relaxed uppercase text-[#555555]">
                    <Link
                      href="/news"
                      className="hover:text-[#38AE34] transition-colors"
                    >
                      Новости
                    </Link>
                    <Link
                      href="/contact"
                      className="hover:text-[#38AE34] transition-colors"
                    >
                      Контакты
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Info */}
            <div className="flex gap-10 items-center">
              <a
                href={`tel:${
                  settings?.header?.phone ||
                  footerData?.headerPhone ||
                  "+7 (495) 260 20 60"
                }`}
                className="text-base font-bold leading-relaxed uppercase text-[#555555] hover:text-[#38AE34] transition-colors"
              >
                {settings?.header?.phone ||
                  footerData?.headerPhone ||
                  "+7 (495) 260 20 60"}
              </a>
              <div className="flex gap-4">
                {/* Show all social links from the settings */}
                {settings?.header?.socialLinks?.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transform hover:scale-[1.1] transition-all"
                    title={link.title || link.platform}
                  >
                    <div className="w-5 aspect-square [&>img]:hover:brightness-100 [&>img]:hover:saturate-100 [&>img]:hover:[filter:invert(56%)_sepia(53%)_saturate(652%)_hue-rotate(93deg)_brightness(95%)_contrast(101%)]">
                      {link.icon?.url ? (
                        <Image
                          src={link.icon.url}
                          alt={link.icon.alt || link.platform}
                          className="w-full h-full transition-all"
                          width={20}
                          height={20}
                          unoptimized
                        />
                      ) : (
                        <SocialIconComponent platform={link.platform} />
                      )}
                    </div>
                  </a>
                ))}

                {/* Fallback for backward compatibility */}
                {(!settings?.header?.socialLinks ||
                  settings.header.socialLinks.length === 0) && (
                  <>
                    <a
                      href={
                        footerData?.telegramLink ||
                        "https://t.me/hettautomotive"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transform hover:scale-[1.1] transition-all"
                    >
                      <div className="w-5 aspect-square [&>img]:hover:brightness-100 [&>img]:hover:saturate-100 [&>img]:hover:[filter:invert(56%)_sepia(53%)_saturate(652%)_hue-rotate(93deg)_brightness(95%)_contrast(101%)]">
                        <Image
                          src={TelegramIcon}
                          alt="Telegram"
                          className="w-full h-full transition-all"
                        />
                      </div>
                    </a>
                    <a
                      href={
                        footerData?.whatsappLink || "https://wa.me/74952602060"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transform hover:scale-[1.1] transition-all"
                    >
                      <div className="w-5 aspect-square [&>img]:hover:brightness-100 [&>img]:hover:saturate-100 [&>img]:hover:[filter:invert(56%)_sepia(53%)_saturate(652%)_hue-rotate(93deg)_brightness(95%)_contrast(101%)]">
                        <Image
                          src={WhatsAppIcon}
                          alt="WhatsApp"
                          className="w-full h-full transition-all"
                        />
                      </div>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row: Search and VIN */}
          <div
            className={`flex gap-5 w-full transition-all duration-300 transform ${
              isScrolled
                ? "-translate-y-[25px] opacity-0"
                : "translate-y-0 opacity-100"
            } mb-5`}
          >
            {/* Search Bar */}
            <div ref={searchRef} className="flex-1 relative">
              <div className="flex items-center gap-2">
                <div className="flex-1 border border-[#8898A4] hover:border-[#38AE34] focus-within:border-[#38AE34] transition-colors group h-[42px]">
                  <div className="flex gap-2.5 items-center px-5 h-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#555555] group-focus-within:text-[#38AE34] transition-colors w-6 aspect-square"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Поиск по названию, артикулу или OEM"
                      className="flex-1 text-sm leading-relaxed outline-none roboto-condensed-regular placeholder:text-[#8898A4]"
                    />
                  </div>
                </div>
                <Button
                  label="Найти"
                  variant="noArrow2"
                  onClick={handleSearchSubmit}
                  className="px-6 hover:text-black"
                />
              </div>
            </div>

            {/* VIN Search Button */}
            <Button
              label="Запросить по VIN"
              variant="noArrow"
              className="max-w-[158px] border-none"
              onClick={() => setIsVinModalOpen(true)}
            />
          </div>
        </div>

        {/* Mobile Header - Visible only on mobile */}
        <div className="md:hidden relative py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex self-stretch relative group">
              <Image
                src={logo}
                alt="Логотип Hett Automotive"
                className="object-contain"
                width={170}
                height={50}
              />
            </Link>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2">
              {/* Search Icon - Appears when scrolled on mobile */}
              <button
                onClick={() => setIsScrolled(false)}
                className={`hidden md:block transition-all duration-300 transform ${
                  isScrolled
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                } hover:text-[#38AE34] p-2`}
                aria-label="Open search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#555555] hover:text-[#38AE34] transition-colors "
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </button>

              {/* Menu Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsMobileSearchOpen(false);
                  setIsMobileCatalogOpen(false);
                }}
                className="flex flex-row-reverse font-medium items-center text-gray-600 px-2 gap-2"
              >
                МЕНЮ
                <div className="flex flex-col gap-1">
                  <div className="w-5 h-0.5 bg-[#555555]"></div>
                  <div className="w-5 h-0.5 bg-[#555555]"></div>
                  <div className="w-5 h-0.5 bg-[#555555]"></div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-row justify-between mt-4 h-[40px] items-center">
            <div className="flex flex-row justify-between w-full">
              <button
                className="flex items-center bg-[#38AE34] px-4 border border-[#38AE34] text-white uppercase font-bold roboto-condensed-bold text-sm"
                onClick={() => {
                  if (isMobileMenuOpen) {
                    setIsMobileMenuOpen(false);
                  }
                  setIsMobileSearchOpen(false);
                  setIsMobileCatalogOpen(!isMobileCatalogOpen);
                }}
              >
                <svg
                  width="18"
                  height="40px"
                  viewBox="0 0 18 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path
                    d="M0 0H18V2H0V0ZM0 5H18V7H0V5ZM0 10H18V12H0V10Z"
                    fill="currentColor"
                  />
                </svg>
                Каталог
              </button>  
              {/* VIN Request for Mobile */}
              <div className="">
                <Button
                  label="Запрос по VIN"
                  variant="noArrow"
                  className="w-[115px]"
                  onClick={() => setIsVinModalOpen(true)}
                />
              </div>
            </div>
            {/*Search icon for mobile*/}
            <div className="w-[116px] flex justify-end">
              <div 
                className={`h-[42px] w-[42px] flex justify-center items-center border cursor-pointer transition-colors ${
                  isMobileSearchOpen ? "border-[#38AE34]" : "border-[#8898A4] hover:border-[#38AE34]"
                }`}
                onClick={() => {
                  setIsMobileSearchOpen(!isMobileSearchOpen);
                  setIsMobileMenuOpen(false);
                  setIsMobileCatalogOpen(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-colors w-5 aspect-square ${
                    isMobileSearchOpen ? "text-[#38AE34]" : "text-[#555555]"
                  }`}
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile Search - Shown when search icon is clicked */}
          <div
           className={`transition-all duration-300 transform ${
             isMobileSearchOpen ? "translate-y-0 opacity-100 pointer-events-auto mt-4" : "-translate-y-1 opacity-0 pointer-events-none h-0 mt-0"
           }`}
         >
           {/* Mobile Search */}
           <div ref={searchRef} className="relative w-full">
             <div className="flex items-center gap-2">
               <div className="flex-1 border border-[#8898A4] hover:border-[#38AE34] focus-within:border-[#38AE34] transition-colors group h-10 max-w-[1060px]">
                 <div className="flex gap-2.5 items-center px-4 h-full">
                   <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2.5"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="text-[#555555] group-focus-within:text-[#38AE34] transition-colors w-5 aspect-square"
                   >
                     <circle cx="11" cy="11" r="8"></circle>
                     <path d="m21 21-4.3-4.3"></path>
                   </svg>
                   <input
                     type="text"
                     value={searchQuery}
                     onChange={handleSearchChange}
                     onKeyDown={handleSearchKeyDown}
                     placeholder="Поиск по названию, артикулу или OEM"
                     className="flex-1 text-sm leading-relaxed outline-none roboto-condensed-regular placeholder:text-[#8898A4]"
                   />
                 </div>
               </div>
               <Button
                 label="Найти"
                 variant="noArrow2"
                 onClick={handleSearchSubmit}
                 className="px-2 max-w-[50px] hover:text-black"
               />
             </div>
           </div>
         </div>

          {/* Remove the old scroll-based mobile search */}
          {/* Mobile Search and VIN - Hidden when scrolled */}
          <div className="hidden">
            {/* Mobile Search */}
            <div ref={searchRef} className="relative w-full">
              <div className="flex items-center gap-2">
                <div className="flex-1 border border-[#8898A4] hover:border-[#38AE34] focus-within:border-[#38AE34] transition-colors group h-10 max-w-[1060px]">
                  <div className="flex gap-2.5 items-center px-4 h-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#555555] group-focus-within:text-[#38AE34] transition-colors w-5 aspect-square"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Поиск по названию, артикулу или OEM"
                      className="flex-1 text-sm leading-relaxed outline-none roboto-condensed-regular placeholder:text-[#8898A4]"
                    />
                  </div>
                </div>
                <Button
                  label="Найти"
                  variant="noArrow2"
                  onClick={handleSearchSubmit}
                  className="px-4 hover:text-black"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIN Request Modal (shared between mobile and desktop) */}
      <VinRequestModal
        isOpen={isVinModalOpen}
        onClose={() => setIsVinModalOpen(false)}
      />

      {/* Mobile Menu - Render unconditionally, control via isOpen prop */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        customPages={customPages}
        categories={categories}
      />

      {/* Mobile Catalog Dropdown */}
      <div
        className={`
          fixed left-0 right-0 bg-white 
          transform transition-all duration-300 ease-in-out
          ${isMobileCatalogOpen ? "opacity-100 visible" : "opacity-0 invisible"}
          top-[140px]
          md:hidden
          z-40
          h-auto
          max-h-[calc(100vh-140px)]
          overflow-y-auto
          shadow-lg
        `}
      >
        <div className="flex flex-col gap-3 p-5">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.slug}`}
                className="flex items-center py-2 w-full hover:bg-gray-50 transition-colors overflow-hidden"
                onClick={() => setIsMobileCatalogOpen(false)}
              >
                {/* Compact image thumbnail */}
                <div className="w-12 h-12 mr-3 overflow-hidden flex-shrink-0">
                  {category.image?.url ? (
                    <Image
                      src={
                        category.image.url.startsWith("/")
                          ? `${API_URL}${category.image.url}`
                          : category.image.url
                      }
                      alt={category.name}
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-300"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Category name */}
                <span className="text-[#555555] hover:text-[#38AE34] transition-colors text-[14px] font-medium roboto-condensed-medium">
                  {category.name}
                </span>
              </Link>
            ))
          ) : (
            <div className="py-3 text-gray-500 text-center">
              Загрузка категорий...
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Helper component for social icons
const SocialIconComponent = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "telegram":
      return (
        <Image
          src={TelegramIcon}
          alt="Telegram"
          className="w-full h-full transition-all"
        />
      );
    case "whatsapp":
      return (
        <Image
          src={WhatsAppIcon}
          alt="WhatsApp"
          className="w-full h-full transition-all"
        />
      );
    // Add more social media icons as needed
    default:
      return <div className="w-5 h-5 bg-gray-300 rounded-full"></div>;
  }
};
