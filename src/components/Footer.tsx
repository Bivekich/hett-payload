"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import logo from "@/assets/HettWhiteLogo.svg";
import TelegramIcon from "@/assets/icons/tgIcon.svg"; // Import default Telegram icon
import WhatsAppIcon from "@/assets/icons/whatsappIcon.svg"; // Import default WhatsApp icon
import { getCustomPages, getSettings } from "@/services/api";
import { getCategories } from "@/services/catalogApi";
import { Category } from "@/types/catalog";
import { API_URL } from "@/services/api"; // Import API_URL

// Define an interface for social media links
interface SocialLink {
  platform: string;
  url: string;
  icon?: { url: string }; // Updated type
  title?: string;
}

interface FooterData {
  headerPhone?: string;
  phone?: string;
  phoneLabel?: string;
  email?: string;
  emailLabel?: string;
  address?: string;
  addressLabel?: string; // Added this field
  socialLinks?: SocialLink[]; // Changed to store all social links
  copyright?: string;
  termsOfUse?: string;
  termsOfUseLink?: string;
  privacyPolicy?: string;
  privacyPolicyLink?: string;
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customPages, setCustomPages] = useState<Array<{
    id: number;
    title: string;
    slug: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch settings from CMS
        const settings = await getSettings();
        
        // Map CMS settings to footerData format
        if (settings) {
          setFooterData({
            headerPhone: settings.header?.phone || "+7 (495) 260 20 60",
            phone: settings.footer?.phone || "+7 (495) 260 20 60",
            phoneLabel: settings.footer?.phoneLabel || "Телефон для связи",
            email: settings.footer?.email || "info@hett-auto.ru",
            emailLabel: settings.footer?.emailLabel || "Email для связи",
            address: settings.footer?.address || "Москва, ул. Примерная, д. 123",
            addressLabel: settings.footer?.addressLabel || "Наш адрес",
            // Store all social links instead of just telegram and whatsapp
            socialLinks: settings.footer?.socialLinks || [],
            copyright: settings.footer?.legalDocuments?.copyright || "© 2024 Hett Automotive. Все права защищены",
            termsOfUse: settings.footer?.legalDocuments?.termsOfUse?.label || "Условия использования",
            termsOfUseLink: settings.footer?.legalDocuments?.termsOfUse?.url || "/terms",
            privacyPolicy: settings.footer?.legalDocuments?.privacyPolicy?.label || "Политика защиты данных",
            privacyPolicyLink: settings.footer?.legalDocuments?.privacyPolicy?.url || "/privacy",
          });
        } else {
          // Fallback to default values if settings not found
          setFooterData({
            headerPhone: "+7 (495) 260 20 60",
            phone: "+7 (495) 260 20 60",
            phoneLabel: "Телефон для связи",
            email: "info@hett-auto.ru",
            emailLabel: "Email для связи",
            address: "Москва, ул. Примерная, д. 123",
            addressLabel: "Наш адрес",
            socialLinks: [
              { platform: "telegram", url: "https://t.me/hettautomotive", title: "Telegram" },
              { platform: "whatsapp", url: "https://wa.me/74952602060", title: "WhatsApp" },
            ],
            copyright: "© 2024 Hett Automotive. Все права защищены",
            termsOfUse: "Условия использования",
            termsOfUseLink: "/terms",
            privacyPolicy: "Политика защиты данных",
            privacyPolicyLink: "/privacy",
          });
        }

        // Fetch real categories from the API
        try {
          const categoriesResponse = await getCategories({
            limit: 10, // Limit to 10 categories for the footer
            sort: "name" // Sort alphabetically by name
          });
          setCategories(categoriesResponse.docs);
        } catch (err) {
          console.error("Error fetching categories:", err);
          setCategories([]);
        }

        // Fetch custom pages
        try {
          const pages = await getCustomPages();
          setCustomPages(pages);
        } catch (err) {
          console.error("Error fetching custom pages:", err);
        }

        setIsLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : String(err));
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to render social icon component based on platform
  const renderSocialIcon = (platform: string, customIcon?: { url: string }) => {
    // Prioritize custom icon from CMS
    if (customIcon && customIcon.url) {
      return (
        <Image
          src={customIcon.url.startsWith('/') ? `${API_URL}${customIcon.url}` : customIcon.url}
          alt={platform}
          width={25}
          height={25}
          className="object-contain shrink-0 self-stretch my-auto w-[20px] sm:w-[22px] md:w-[25px] aspect-square"
          unoptimized // Use unoptimized for external URLs
        />
      );
    }

    // Use default imported icons if no custom icon
    switch (platform.toLowerCase()) {
      case "telegram":
        return (
          <Image
            src={TelegramIcon}
            alt="Telegram"
            width={25}
            height={25}
            className="object-contain shrink-0 self-stretch my-auto aspect-[1.19] w-[20px] sm:w-[22px] md:w-[25px] [filter:invert(56%)_sepia(53%)_saturate(652%)_hue-rotate(93deg)_brightness(95%)_contrast(101%)]"
          />
        );
      case "whatsapp":
        return (
          <Image
            src={WhatsAppIcon}
            alt="WhatsApp"
            width={22}
            height={22}
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px] sm:w-[20px] md:w-[22px] [filter:invert(56%)_sepia(53%)_saturate(652%)_hue-rotate(93deg)_brightness(95%)_contrast(101%)]"
          />
        );
      // Add more cases for other default icons as needed
      default:
        // Return a placeholder if no icon is available
        return (
          <div className="w-[20px] h-[20px] bg-gray-400 rounded-full"></div>
        );
    }
  };

  if (isLoading) return null;
  if (error) return null;
  if (!footerData) return null;

  // Find specific social links for the header section of the footer
  const headerTelegramLink = footerData.socialLinks?.find(link => link.platform === "telegram");
  const headerWhatsappLink = footerData.socialLinks?.find(link => link.platform === "whatsapp");

  return (
    <div className="w-full bg-[#181818]">
      <Container>
        <footer className="overflow-hidden flex-col pt-8 pb-10">
          {/* Top Section with Logo and Contact */}

          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-10 justify-between items-center w-full min-h-[60px] sm:min-h-[70px] md:min-h-[83px]">
            {/* Logo Section */}
            <Link
              href="/"
              className="flex overflow-hidden gap-4 md:gap-6 items-center self-stretch my-auto bg-slate-50 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Image
                src={logo}
                alt="Company Logo"
                className=" object-contain"
              />
            </Link>

            {/* Contact Info */}
            <div className="flex gap-4 sm:gap-6 md:gap-8 items-center self-stretch my-auto text-[16px] font-bold leading-relaxed text-white uppercase">
              <a
                href={`tel:${footerData?.headerPhone || "+7 (495) 260 20 60"}`}
                className="self-stretch my-auto hover:text-[#38AE34] transition-colors cursor-pointer whitespace-nowrap"
              >
                {footerData.headerPhone}
              </a>
              <div className="flex gap-4 sm:gap-6 md:gap-8">
                {/* Display Telegram and WhatsApp in header using renderSocialIcon */}
                {headerTelegramLink && (
                  <a
                    href={headerTelegramLink.url.startsWith("http") ? headerTelegramLink.url : `https://${headerTelegramLink.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 hover:text-[#38AE34] transition-all"
                  >
                    {renderSocialIcon("telegram", headerTelegramLink.icon)}
                  </a>
                )}
                {headerWhatsappLink && (
                  <a
                    href={headerWhatsappLink.url.startsWith("http") ? headerWhatsappLink.url : `https://${headerWhatsappLink.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 hover:text-[#38AE34] transition-all"
                  >
                    {renderSocialIcon("whatsapp", headerWhatsappLink.icon)}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-8 md:mt-10">
            {/* Products Column */}
            <div
              className={`flex flex-col ${
                categories.length > 4 ? "sm:col-span-2" : "sm:col-span-1"
              } lg:col-span-1`}
            >
              <h3 className="text-[18px] sm:text-[18px] font-bold leading-none text-white roboto-condensed-bold">
                Продукция
              </h3>
              <div
                className={`flex ${
                  categories.length > 4 ? "flex-row gap-x-8" : "flex-col"
                } mt-6 md:mt-8`}
              >
                {/* First column (first 4 categories) */}
                <nav
                  className="flex flex-col gap-y-3 md:gap-y-4 w-full leading-snug text-gray-400
                2xl:text-base
                xl:text-base
                lg:text-sm
                md:text-sm
                max-md:text-xs roboto-condensed-regular"
                >
                  {categories.slice(0, 4).map((category) => (
                    <Link
                      key={category.id}
                      href={`/catalog/${category.slug}`}
                      className="hover:text-[#38AE34] transition-colors cursor-pointer"
                      onClick={handleNavigation}
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
                {/* Second column (next 4 categories) */}
                {categories.length > 4 && (
                  <nav
                    className="flex flex-col gap-y-3 md:gap-y-4 w-full mt-3 sm:mt-0 leading-snug text-gray-400
                  2xl:text-base
                  xl:text-base
                  lg:text-sm
                  md:text-sm
                  max-md:text-xs roboto-condensed-regular"
                  >
                    {categories.slice(4, 8).map((category) => (
                      <Link
                        key={category.id}
                        href={`/catalog/${category.slug}`}
                        className="hover:text-[#38AE34] transition-colors cursor-pointer"
                        onClick={handleNavigation}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>
            </div>

            {/* About Column */}
            <div className="flex flex-col">
              <h3 className="text-[18px] sm:text-[18px] font-bold leading-none text-white roboto-condensed-bold">
                О компании
              </h3>
              <nav
                className="flex flex-col gap-y-3 md:gap-y-4 mt-6 md:mt-8 leading-snug text-gray-400
                2xl:text-base
                xl:text-base
                lg:text-sm
                md:text-sm
                max-md:text-xs roboto-condensed-regular"
              >
                <Link
                  href="/about"
                  className="hover:text-[#38AE34] transition-colors cursor-pointer"
                  onClick={handleNavigation}
                >
                  О компании Hett Automotive
                </Link>
                <Link
                  href="/news"
                  className="hover:text-[#38AE34] transition-colors cursor-pointer"
                  onClick={handleNavigation}
                >
                  Новости
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-[#38AE34] transition-colors cursor-pointer"
                  onClick={handleNavigation}
                >
                  Контакты
                </Link>
                {/* Add custom pages */} 
                {customPages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/pages/${page.slug}/${page.id}`}
                    className="hover:text-[#38AE34] transition-colors cursor-pointer"
                    onClick={handleNavigation}
                  >
                    {page.title}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Info Column */}
            <div className="flex flex-col">
              <h3 className="text-[18px] sm:text-[18px] font-bold leading-none text-white roboto-condensed-bold">
                Контакты
              </h3>
              <div className="flex flex-col gap-y-3 md:gap-y-4 mt-6 md:mt-8 leading-snug text-white roboto-condensed-regular">
                {/* Phone */}
                <div className="flex gap-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.1733 11.38C11.58 11.38 10.9933 11.2467 10.46 10.98C10.1533 10.8267 9.78667 10.8933 9.56 11.1267L8.32 12.68C6.2 11.6267 4.38 9.80667 3.32 7.68667L4.88667 6.45333C5.12 6.22667 5.18 5.86 5.02667 5.55333C4.76 5.02 4.62667 4.43333 4.62667 3.84C4.62667 3.42667 4.28 3.08 3.86667 3.08H1.33333C0.92 3.08 0.666667 3.42667 0.666667 3.84C0.666667 10.0867 5.92 15.34 12.1667 15.34C12.58 15.34 12.9333 15.0867 12.9333 14.6733V12.14C12.9333 11.7267 12.5867 11.38 12.1733 11.38Z" fill="#38AE34"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">{footerData.phoneLabel}</span>
                    <a href={`tel:${footerData.phone}`} className="hover:text-[#38AE34] transition-colors cursor-pointer">
                      {footerData.phone}
                    </a>
                  </div>
                </div>
                {/* Email */}
                <div className="flex gap-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M14.6667 0H1.33333C0.6 0 0 0.6 0 1.33333V10.6667C0 11.4 0.6 12 1.33333 12H14.6667C15.4 12 16 11.4 16 10.6667V1.33333C16 0.6 15.4 0 14.6667 0ZM14.6667 2.66667L8 6.66667L1.33333 2.66667V1.33333L8 5.33333L14.6667 1.33333V2.66667Z" fill="#38AE34"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">{footerData.emailLabel}</span>
                    <a href={`mailto:${footerData.email}`} className="hover:text-[#38AE34] transition-colors cursor-pointer">
                      {footerData.email}
                    </a>
                  </div>
                </div>
                {/* Address */}
                <div className="flex gap-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path d="M6.99999 0C3.13999 0 0 3.14 0 7C0 12.25 6.99999 16 6.99999 16C6.99999 16 14 12.25 14 7C14 3.14 10.86 0 6.99999 0ZM6.99999 9.5C5.61999 9.5 4.49999 8.38 4.49999 7C4.49999 5.62 5.61999 4.5 6.99999 4.5C8.37999 4.5 9.49999 5.62 9.49999 7C9.49999 8.38 8.37999 9.5 6.99999 9.5Z" fill="#38AE34"/>
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">{footerData.addressLabel}</span>
                    <span className="text-white">{footerData.address}</span>
                  </div>
                </div>
                {/* Social Media Links */}
                <div className="flex flex-wrap gap-4 mt-4">
                  {footerData.socialLinks?.map((link, index) => (
                    <a
                      key={index}
                      href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:scale-110 transition-all"
                      title={link.title || link.platform}
                    >
                      {renderSocialIcon(link.platform, link.icon)}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section with Copyright and Legal Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 justify-between items-center w-full mt-10 pt-6 border-t border-gray-700 text-xs text-gray-400 font-[Roboto_Condensed]">
            <p>{footerData.copyright}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href={footerData.termsOfUseLink || "#"} className="hover:text-[#38AE34] transition-colors">
                {footerData.termsOfUse}
              </Link>
              <Link href={footerData.privacyPolicyLink || "#"} className="hover:text-[#38AE34] transition-colors">
                {footerData.privacyPolicy}
              </Link>
            </div>
          </div>
        </footer>
      </Container>
    </div>
  );
}