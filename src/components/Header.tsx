"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { debounce } from "lodash";
import logo from "../assets/HettLogo.svg";
import Button from "./uiKit/Button";
import TelegramIcon from "../assets/icons/tgIcon.svg";
import WhatsAppIcon from "../assets/icons/whatsappIcon.svg";
import DropdownMenu from "./uiKit/DropdownMenu";
import React from "react";
import CatalogDropdownMenu from "./CatalogDropdownMenu";
import VinRequestModal from "./uiKit/VinRequestModal";
import { getCustomPages, getSettings } from "@/services/api";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  customPages: { id: number; title: string; slug: string }[];
}

interface Product {
  id: number;
  name: string;
  article?: string;
  slug: string;
  brand?: string;
  model?: string;
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

function MobileMenu({ isOpen, onClose, customPages }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showCatalogSubmenu, setShowCatalogSubmenu] = useState(false);
  const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);

  const handleNavigation = () => {
    onClose();
  };

  const toggleCatalogSubmenu = () => {
    setShowCatalogSubmenu(!showCatalogSubmenu);
  };

  const toggleAboutSubmenu = () => {
    setShowAboutSubmenu(!showAboutSubmenu);
  };

  // Import catalog categories from the CatalogDropdownMenu component
  const catalogCategories = [
    {
      id: 1,
      name: "Аккумуляторы",
      slug: "batteries",
    },
    {
      id: 2,
      name: "Кузовные элементы",
      slug: "body-parts",
    },
    {
      id: 3,
      name: "Автомобильные диски и шины",
      slug: "wheels-tires",
    },
    {
      id: 4,
      name: "Запасные части для ходовой части",
      slug: "suspension-parts",
    },
    {
      id: 5,
      name: "Автомобильные аксессуары",
      slug: "accessories",
    },
  ];

  return (
    <div
      ref={menuRef}
      className={`
        fixed top-0 left-0 w-full h-screen bg-black
        transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-y-0" : "-translate-y-full"}
        md:hidden
        z-50
      `}
    >
      <nav className="flex flex-col items-center justify-center h-full p-4">
        {/* About Company with Submenu */}
        <div className="w-full flex flex-col items-center">
          <button
            className="py-6 text-white hover:text-[#38AE34] transition-colors cursor-pointer text-[16px] font-bold uppercase roboto-condensed-bold flex items-center gap-2"
            onClick={toggleAboutSubmenu}
          >
            О компании Hett Automotive
            <svg
              width="10"
              height="5"
              viewBox="0 0 10 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transform transition-transform ${
                showAboutSubmenu ? "rotate-180" : ""
              }`}
            >
              <path d="M0 0L5 5L10 0H0Z" fill="currentColor" />
            </svg>
          </button>

          {showAboutSubmenu && (
            <div className="flex flex-col w-full items-center">
              <Link
                href="/about"
                className="py-3 text-[#38AE34] hover:text-white transition-colors cursor-pointer text-[14px] font-medium roboto-condensed-medium"
                onClick={() => handleNavigation()}
              >
                О компании
              </Link>
              {customPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/pages/${page.slug}`}
                  className="py-3 text-[#38AE34] hover:text-white transition-colors cursor-pointer text-[14px] font-medium roboto-condensed-medium"
                  onClick={() => handleNavigation()}
                >
                  {page.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Catalog Link with Submenu */}
        <div className="w-full flex flex-col items-center">
          <button
            className="py-6 text-white hover:text-[#38AE34] transition-colors cursor-pointer text-[16px] font-bold uppercase roboto-condensed-bold flex items-center gap-2"
            onClick={toggleCatalogSubmenu}
          >
            Каталог
            <svg
              width="10"
              height="5"
              viewBox="0 0 10 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transform transition-transform ${
                showCatalogSubmenu ? "rotate-180" : ""
              }`}
            >
              <path d="M0 0L5 5L10 0H0Z" fill="currentColor" />
            </svg>
          </button>

          {showCatalogSubmenu && (
            <div className="flex flex-col w-full items-center">
              {catalogCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/catalog/${category.slug}`}
                  className="py-3 text-[#38AE34] hover:text-white transition-colors cursor-pointer text-[14px] font-medium roboto-condensed-medium"
                  onClick={() => handleNavigation()}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/news"
          className="py-6 text-white hover:text-[#38AE34] transition-colors cursor-pointer text-xl font-bold uppercase roboto-condensed-bold"
          onClick={() => handleNavigation()}
        >
          Новости
        </Link>
        <Link
          href="/contact"
          className="py-6 text-white hover:text-[#38AE34] transition-colors cursor-pointer text-xl font-bold uppercase roboto-condensed-bold"
          onClick={() => handleNavigation()}
        >
          Контакты
        </Link>
      </nav>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-[#38AE34] transition-colors"
        aria-label="Close menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [isVinModalOpen, setIsVinModalOpen] = useState(false);
  const [customPages, setCustomPages] = useState<{ id: number; title: string; slug: string }[]>([]);

  // Handle clicks outside of search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        // In a real app, you would fetch data from an API here
        // For now, we'll just simulate a search
        const mockResults: Product[] = [
          {
            id: 1,
            name: "Product 1",
            article: "A001",
            slug: "product-1",
            brand: "Brand A",
            model: "Model X",
          },
          {
            id: 2,
            name: "Product 2",
            article: "A002",
            slug: "product-2",
            brand: "Brand B",
            model: "Model Y",
          },
        ];

        setSearchResults(mockResults);
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      }
    }, 300)
  ).current;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(true);
    debouncedSearch(query);
  };

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
            telegramLink: settings.header.socialLinks?.find(link => link.platform === 'telegram')?.url,
            whatsappLink: settings.header.socialLinks?.find(link => link.platform === 'whatsapp')?.url,
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
        const pages = await getCustomPages();
        setCustomPages(pages);
      } catch (err) {
        console.error("Error fetching custom pages:", err);
      }
    };

    fetchCustomPages();
  }, []);

  // Helper to get URL for social link by platform
  const getSocialLinkUrl = (platform: string) => {
    const link = settings?.header?.socialLinks?.find(link => link.platform === platform);
    return link?.url || null;
  };

  // Transform custom pages into menu items format and include about page
  const aboutMenuItems = [
    { text: "О компании", href: "/about" },
    ...customPages.map(page => ({
      text: page.title,
      href: `/pages/${page.slug}`
    }))
  ];

  return (
    <header ref={headerRef} className="w-full bg-white py-5">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block">
          {/* Top Row */}
          <div className="flex flex-wrap gap-5 justify-between w-full">
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

              {/* Navigation Links */}
              <div className="flex items-center">
                <div className="flex gap-8">
                  <DropdownMenu
                    title="О компании Hett Automotive"
                    items={aboutMenuItems}
                  />
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
                href={`tel:${settings?.header?.phone || footerData?.headerPhone || "+7 (495) 260 20 60"}`}
                className="text-base font-bold leading-relaxed uppercase text-[#555555] hover:text-[#38AE34] transition-colors"
              >
                {settings?.header?.phone || footerData?.headerPhone || "+7 (495) 260 20 60"}
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
                        <img
                          src={link.icon.url}
                          alt={link.icon.alt || link.platform}
                          className="w-full h-full transition-all"
                        />
                      ) : (
                        <SocialIconComponent platform={link.platform} />
                      )}
                    </div>
                  </a>
                ))}
                
                {/* Fallback for backward compatibility */}
                {(!settings?.header?.socialLinks || settings.header.socialLinks.length === 0) && (
                  <>
                    <a
                      href={footerData?.telegramLink || "https://t.me/hettautomotive"}
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
                      href={footerData?.whatsappLink || "https://wa.me/74952602060"}
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
          <div className="flex gap-5 mt-5 w-full">
            {/* Search Bar */}
            <div ref={searchRef} className="flex-1 relative">
              <div className="flex gap-2.5 items-center h-[42px] px-5 border border-[#8898A4] hover:border-[#38AE34] focus-within:border-[#38AE34] transition-colors group">
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
                  onFocus={() => setShowResults(true)}
                  placeholder="Поиск по названию или артикулу"
                  className="flex-1 text-sm leading-relaxed outline-none roboto-condensed-regular placeholder:text-[#8898A4]"
                />
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="text-sm font-medium text-[#555555] roboto-condensed-medium">
                        {product.brand && product.model
                          ? `${product.brand} ${product.model} - ${product.name}`
                          : product.name}
                      </div>
                      {product.article && (
                        <div className="text-xs text-[#8898A4] roboto-condensed-regular">
                          Артикул: {product.article}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* VIN Search Button */}
            <Button
              label="Запрос по VIN"
              variant="noArrow"
              className="min-w-[200px]"
              onClick={() => setIsVinModalOpen(true)}
            />

            {/* VIN Request Modal */}
            <VinRequestModal
              isOpen={isVinModalOpen}
              onClose={() => setIsVinModalOpen(false)}
            />
          </div>
        </div>

        {/* Mobile Header - Visible only on mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex self-stretch relative group">
              <Image
                src={logo}
                alt="Логотип Hett Automotive"
                className="w-full h-full object-contain"
                width={126}
                height={32}
              />
            </Link>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-3">
              {/* Catalog Button */}
              <button
                className="flex items-center bg-[#38AE34] text-white px-4 py-2"
                onClick={() => {
                  // Close mobile menu if open
                  if (isMobileMenuOpen) {
                    setIsMobileMenuOpen(false);
                  }
                  // Toggle catalog dropdown
                  // You can implement this functionality as needed
                }}
              >
                <svg
                  width="18"
                  height="12"
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
                КАТАЛОГ
              </button>

              {/* Social Links and Menu Button */}
              <div className="items-center space-x-3 hidden md:flex">
                {/* Telegram */}
                <a
                  href={getSocialLinkUrl('telegram') || footerData?.telegramLink || "https://t.me/hettautomotive"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-[1.1] transition-all"
                >
                  <div className="w-6 h-6">
                    <Image
                      src={TelegramIcon}
                      alt="Telegram"
                      className="w-full h-full"
                    />
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={getSocialLinkUrl('whatsapp') || footerData?.whatsappLink || "https://wa.me/74952602060"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-[1.1] transition-all"
                >
                  <div className="w-6 h-6">
                    <Image
                      src={WhatsAppIcon}
                      alt="WhatsApp"
                      className="w-full h-full"
                    />
                  </div>
                </a>

                {/* Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center text-gray-600 px-2"
                >
                  <span className="text-sm font-bold mr-2">МЕНЮ</span>
                  <div className="flex flex-col gap-1">
                    <div className="w-5 h-0.5 bg-[#555555]"></div>
                    <div className="w-5 h-0.5 bg-[#555555]"></div>
                    <div className="w-5 h-0.5 bg-[#555555]"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Search Input (appears below header) */}
          <div className="mt-4">
            <div className="relative flex items-center h-[42px] px-4 border border-[#8898A4] focus-within:border-[#38AE34] transition-colors">
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
                className="text-[#555555] mr-2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
                placeholder="Поиск по названию или артикулу"
                className="flex-1 text-sm leading-relaxed outline-none roboto-condensed-regular placeholder:text-[#8898A4]"
              />
            </div>

            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-[calc(100%-2rem)] mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setShowResults(false);
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="text-sm font-medium text-[#555555] roboto-condensed-medium">
                      {product.brand && product.model
                        ? `${product.brand} ${product.model} - ${product.name}`
                        : product.name}
                    </div>
                    {product.article && (
                      <div className="text-xs text-[#8898A4] roboto-condensed-regular">
                        Артикул: {product.article}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* VIN Request for Mobile */}
          <div className="mt-3">
            <Button
              label="Запрос по VIN"
              variant="noArrow"
              className="w-full"
              onClick={() => setIsVinModalOpen(true)}
            />
          </div>
        </div>

        {/* VIN Request Modal (shared between mobile and desktop) */}
        <VinRequestModal
          isOpen={isVinModalOpen}
          onClose={() => setIsVinModalOpen(false)}
        />

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          customPages={customPages}
        />
      </div>
    </header>
  );
}

// Helper component for social icons
const SocialIconComponent = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'telegram':
      return <Image src={TelegramIcon} alt="Telegram" className="w-full h-full transition-all" />;
    case 'whatsapp':
      return <Image src={WhatsAppIcon} alt="WhatsApp" className="w-full h-full transition-all" />;
    // Add more social media icons as needed
    default:
      return <div className="w-5 h-5 bg-gray-300 rounded-full"></div>;
  }
};
