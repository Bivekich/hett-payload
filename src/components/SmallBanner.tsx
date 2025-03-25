import React from "react";
import Container from "./Container";
import bannerSmall from "../assets/bannerSmall.png";
import { API_URL } from "@/services/api";

interface SmallBannerProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
}

const SmallBanner: React.FC<SmallBannerProps> = ({ title, subtitle, imageSrc }) => {
  // Determine background image source
  const backgroundImage = imageSrc 
    ? (imageSrc.startsWith('/') ? `${API_URL}${imageSrc}` : imageSrc)
    : bannerSmall.src;

  return (
    <div className="relative bg-[#181818] overflow-hidden mx-auto w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#181818] to-transparent" />

      {/* Content */}
      <Container>
        <div className="relative min-h-[180px] z-10 flex flex-col justify-end py-10">
          <h1 className="text-[36px] leading-[1.1] font-extrabold text-white font-[Roboto_Condensed] max-w-[780px]" style={{ color: "#F7F7F7" }}>
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-[18px] mt-2 font-medium text-white font-[Roboto_Condensed] max-w-[600px] opacity-90">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SmallBanner;
