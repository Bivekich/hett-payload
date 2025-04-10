"use client";

import React, { useState, useEffect } from "react";
import SmallBanner from "@/components/SmallBanner";
import ContactInfo from "./components/ContactInfo";
import Map from "./components/Map";
import ContactForm from "./components/ContactForm";
import { getContactData } from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const ContactPage = () => {
  const [pageTitle, setPageTitle] = useState("Контакты Hett Automotive");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const data = await getContactData();
        if (data && data.title) {
          setPageTitle(data.title);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact page title:", error);
        setLoading(false);
      }
    };
    
    fetchTitle();
  }, []);
  
  if (loading) {
    return <div>
      <LoadingSpinner />
    </div>;
  }
  
  return (
    <>
      <SmallBanner title={pageTitle} />
      <main>
        <ContactInfo />
        <Map />
        <ContactForm />
      </main>
    </>
  );
};

export default ContactPage;
