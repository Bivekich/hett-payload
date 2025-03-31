"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import logo from "@/assets/HettWhiteLogo.svg";
import { getCustomPages, getSettings } from "@/services/api";
import { getCategories } from "@/services/catalogApi";
import { Category } from "@/types/catalog";

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

  // Function to get social icon based on platform
  const getSocialIcon = (platform: string, customIcon?: { url: string }) => {
    if (customIcon && customIcon.url) {
      return customIcon.url;
    }

    // Default platform icons
    switch (platform.toLowerCase()) {
      case "telegram":
        return "/icons/telegram.svg";
      case "whatsapp":
        return "/icons/whatsapp.svg";
      // Add more cases as needed
      default:
        return "/icons/default-social.svg";
    }
  };

  if (isLoading) return null;
  if (error) return null;
  if (!footerData) return null;

  // Find specific social links for the header
  const telegramLink = footerData.socialLinks?.find(link => link.platform === "telegram")?.url;
  const whatsappLink = footerData.socialLinks?.find(link => link.platform === "whatsapp")?.url;

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
                {/* Only display Telegram and WhatsApp in header if available */}
                {telegramLink && (
                  <a
                    href={telegramLink.startsWith("http") ? telegramLink : `https://${telegramLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 hover:text-[#38AE34] transition-all"
                  >
                    <Image
                      src={getSocialIcon("telegram")}
                      alt="Telegram"
                      width={25}
                      height={25}
                      className="object-contain shrink-0 self-stretch my-auto aspect-[1.19] w-[20px] sm:w-[22px] md:w-[25px]"
                    />
                  </a>
                )}
                {whatsappLink && (
                  <a
                    href={whatsappLink.startsWith("http") ? whatsappLink : `https://${whatsappLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 hover:text-[#38AE34] transition-all"
                  >
                    <Image
                      src={getSocialIcon("whatsapp")}
                      alt="WhatsApp"
                      width={22}
                      height={22}
                      className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px] sm:w-[20px] md:w-[22px]"
                    />
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

                {/* Second column if more than 4 categories */}
                {categories.length > 4 && (
                  <nav
                    className="flex flex-col gap-y-3 md:gap-y-4 w-full leading-snug text-gray-400
                  2xl:text-base
                  xl:text-base
                  lg:text-sm
                  md:text-sm
                  max-md:text-xs roboto-condensed-regular"
                  >
                    {categories.slice(4).map((category) => (
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

            {/* Information Column */}
            <div className="flex flex-col">
              <h3 className="text-[18px] font-bold leading-none text-white roboto-condensed-bold">
                Актуальная информация
              </h3>
              <nav className="flex flex-col mt-6 md:mt-8 w-full text-sm sm:text-base leading-snug text-gray-400 roboto-condensed-regular">
                <Link
                  href="/about"
                  className="hover:text-[#38AE34] transition-colors cursor-pointer"
                  onClick={() => handleNavigation()}
                >
                  О компании Hett Automotive
                </Link>
                
                {/* Custom Pages as independent menu items */}
                {customPages.map((page) => (
                  <Link
                    key={page.id}
                    href={`/pages/${page.slug}/${page.id}`}
                    className="mt-3 md:mt-4 hover:text-[#38AE34] transition-colors cursor-pointer"
                    onClick={() => handleNavigation()}
                  >
                    {page.title}
                  </Link>
                ))}
                
                <Link
                  href="/news"
                  className="mt-3 md:mt-4 hover:text-[#38AE34] transition-colors cursor-pointer"
                  onClick={() => handleNavigation()}
                >
                  Новости
                </Link>
                <Link
                  href="/contact"
                  className="mt-3 md:mt-4 hover:text-[#38AE34] transition-colors cursor-pointer"
                  onClick={() => handleNavigation()}
                >
                  Контактная информация
                </Link>
              </nav>
            </div>

            {/* Contact Details Column */}
            <div className="flex flex-col sm:col-span-2 lg:col-span-1">
              <div className="flex flex-col justify-center w-full leading-tight">
                <a
                  href={`tel:${footerData?.phone || "+7 (495) 260 20 60"}`}
                  className="text-gray-400 hover:text-[#38AE34] transition-colors cursor-pointer
                  2xl:text-xl
                  xl:text-lg
                  lg:text-base
                  md:text-base
                  max-md:text-sm font-semibold roboto-condensed-semibold"
                >
                  {footerData.phone}
                </a>
                <div
                  className="mt-2 sm:mt-2.5 text-slate-50 font-medium
                2xl:text-sm
                xl:text-sm
                lg:text-xs
                md:text-xs
                max-md:text-xs roboto-condensed-medium"
                >
                  {footerData.phoneLabel}
                </div>
              </div>
              <div className="flex flex-col justify-center mt-6 md:mt-10 w-full leading-tight whitespace-nowrap">
                <a
                  href={`mailto:${footerData.email}`}
                  className="text-[16px] font-semibold text-gray-400 hover:text-[#38AE34] transition-colors cursor-pointer roboto-condensed-semibold"
                >
                  {footerData.email}
                </a>
                <div className="mt-2 sm:mt-2.5 text-[16px] font-medium text-slate-50 roboto-condensed-medium">
                  {footerData.emailLabel}
                </div>
              </div>
              <address className="flex flex-col justify-center mt-6 md:mt-10 w-full not-italic">
                <div className="text-[16px] font-semibold leading-7 sm:leading-8 text-gray-400 hover:text-[#38AE34] transition-colors cursor-pointer roboto-condensed-semibold">
                  {footerData.address}
                </div>
                {footerData.addressLabel && (
                  <div className="mt-2 sm:mt-2.5 text-[16px] font-medium text-slate-50 roboto-condensed-medium">
                    {footerData.addressLabel}
                  </div>
                )}
              </address>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-10 justify-between items-start sm:items-center pt-8 mt-8 w-full text-sm sm:text-base leading-relaxed text-gray-400 border-t border-gray-700">
            <div className="w-full sm:w-auto hover:text-[#38AE34] transition-colors roboto-condensed-regular">
              {footerData.copyright}
            </div>
            <nav className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 items-start sm:items-center roboto-condensed-regular">
              <Link
                href={footerData.termsOfUseLink || "/terms"}
                className="hover:text-[#38AE34] transition-colors"
              >
                {footerData.termsOfUse}
              </Link>
              <Link
                href={footerData.privacyPolicyLink || "/privacy"}
                className="hover:text-[#38AE34] transition-colors"
              >
                {footerData.privacyPolicy}
              </Link>
            </nav>
          </div>
        </footer>
      </Container>
    </div>
  );
}