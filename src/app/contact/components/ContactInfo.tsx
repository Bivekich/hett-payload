"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";
import { getContactData } from "@/services/api";

// Types for our contact items
interface ContactItem {
  title?: string;
  text1: string;
  text2?: string;
  href?: string;
  columnWidth: string;
  order: number;
}

interface ContactInfoSection {
  enabled: boolean;
  contactItems?: ContactItem[];
  backgroundColor?: string;
  padding?: string;
}

interface ContactDataType {
  contactInfoSection?: ContactInfoSection;
  // Add other properties as needed
}

const ContactInfo = () => {
  const [contactData, setContactData] = useState<ContactDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const data = await getContactData();
        setContactData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        setError(typeof error === 'string' ? error : 'Failed to load contact information');
        setLoading(false);
      }
    };
    
    fetchContactData();
  }, []);
  
  // If the contact section is disabled or loading or error
  if (loading) {
    return (
      <div className="bg-[#F5F5F5] py-12">
        <Container>
          <div className="text-center">Loading contact information...</div>
        </Container>
      </div>
    );
  }
  
  if (error || !contactData) {
    return (
      <div className="bg-[#F5F5F5] py-12">
        <Container>
          <div className="text-center text-red-500">{error || 'Contact information not found'}</div>
        </Container>
      </div>
    );
  }
  
  // If contact info section is disabled
  if (!contactData.contactInfoSection?.enabled) {
    return null;
  }
  
  // Get the section configuration
  const sectionConfig = contactData.contactInfoSection;
  const contactItems: ContactItem[] = sectionConfig.contactItems || [];
  const bgColor = sectionConfig.backgroundColor || '#F5F5F5';
  const padding = sectionConfig.padding || 'py-12';

  // Sort contact items by order
  const sortedItems = [...contactItems].sort((a, b) => a.order - b.order);

  // Find if any items have titles to determine if we need spacing
  const hasTitles = sortedItems.some(item => item.title);

  return (
    <div className={`${padding}`} style={{ backgroundColor: bgColor }}>
      <Container>
        <div className="flex flex-wrap">
          {sortedItems.map((item, index) => {
            // Calculate width class based on columnWidth
            const widthClass = `w-full ${
              item.columnWidth === '25' ? 'md:w-1/4' : 
              item.columnWidth === '50' ? 'md:w-1/2' : 
              item.columnWidth === '75' ? 'md:w-3/4' : 
              'md:w-full'
            }`;

            // Check if this is a "header" type item (has only title)
            const isHeaderItem = item.title && (!item.text1 || item.text1 === '');

            return (
              <div key={index} className={`${widthClass} p-2 mb-4`}>
                <div className="h-full">
                  {/* Title - if present */}
                  {item.title ? (
                    <h2 className="text-[28px] font-extrabold font-[Roboto_Condensed] text-black mb-2">
                      {item.title}
                    </h2>
                  ) : (
                    // Add empty spacing div if some items have titles but this one doesn't
                    hasTitles && <div className="h-[42px] mb-2"></div>
                  )}

                  {/* Text content - if present */}
                  {item.text1 && (
                    <div className={`flex flex-col ${isHeaderItem ? 'mt-0' : ''}`}>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[20px] font-semibold font-[Roboto_Condensed] text-[#8898A4] hover:text-[#38AE34] transition-colors"
                        >
                          {item.text1}
                        </a>
                      ) : (
                        <p className="text-[20px] font-semibold font-[Roboto_Condensed] text-[#8898A4]">
                          {item.text1}
                        </p>
                      )}
                      {item.text2 && (
                        <span className="text-[16px] font-medium font-[Roboto_Condensed] text-[#181818] mt-2">
                          {item.text2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default ContactInfo;
