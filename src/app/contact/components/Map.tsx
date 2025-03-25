"use client";

import { useState, useEffect } from "react";
import { getContactData } from "@/services/api";

interface MapSection {
  enabled: boolean;
  embedUrl?: string;
  height?: number;
  title?: string;
}

interface ContactDataType {
  mapSection?: MapSection;
  // Add other properties as needed
}

const Map = () => {
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
        setError(typeof error === 'string' ? error : 'Failed to load map');
        setLoading(false);
      }
    };
    
    fetchContactData();
  }, []);
  
  // Handle loading state
  if (loading) {
    return <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center">Loading map...</div>;
  }
  
  // Handle error state
  if (error || !contactData) {
    return null;
  }
  
  // If map section is disabled
  if (!contactData.mapSection?.enabled) {
    return null;
  }
  
  // Get the map configuration
  const mapConfig = contactData.mapSection;
  const embedUrl = mapConfig.embedUrl || "https://yandex.ru/map-widget/v1/?um=constructor%3A6d38c6c66e895056c2d30cee5b28604470ed7b83e2df1c1c96b722edff797552&amp;source=constructor";
  const height = mapConfig.height || 540;
  const title = mapConfig.title || "Hett Automotive Map";

  return (
    <div className="w-full">
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        title={title}
        className="w-full"
      />
    </div>
  );
};

export default Map;
