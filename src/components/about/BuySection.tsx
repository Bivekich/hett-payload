import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconWallet,
  IconWidgets,
  IconTime,
  IconTruck,
} from "../../assets/icons";
import { FeatureItem } from "./FeatureItem";
import Button from "../uiKit/Button";
import Container from "../Container";
import protekWeb from "@/assets/protekWeb.png";
import logoMain from "@/assets/logoMain.svg";
import { lexicalToHtml } from "@/utils/lexicalToHtml";
import { BuySection as BuySectionType, Distributor as DistributorType } from "@/types/about";

// Default shops/partners data
const defaultShops = [
  {
    name: "Интернет-магазин автозапчастей",
    url: "https://autoeuro.ru/",
    logo: "/images/about/shops/autoeuro.jpg",
  },
  {
    name: "Запчасти для автомобилей с доставкой по всей России",
    url: "https://www.avtoto.ru/",
    logo: "/images/about/shops/avtoto.jpg",
  },
  {
    name: "Автозапчасти вовремя по оптовым ценам",
    url: "https://emex.ru/",
    logo: "/images/about/shops/emex.jpg",
  },
  {
    name: "Интернет-магазин автозапчастей",
    url: "https://adeopro.ru/",
    logo: "/images/about/shops/adeopro.jpg",
  },
  {
    name: "Автозапчасти шины и диски",
    url: "https://stparts.ru/",
    logo: "/images/about/shops/stparts.jpg",
  },
  {
    name: "Автозапчасти оптом",
    url: "https://www.froza.ru/",
    logo: "/images/about/shops/froza.jpg",
  },
  {
    name: "Решения для автобизнеса",
    url: "https://absel.ru/",
    logo: "/images/about/shops/absel.jpg",
  },
  {
    name: "Интернет-магазин автозапчастей",
    url: "https://www.avdmotors.ru/",
    logo: "/images/about/shops/avdmotors.jpg",
  },
];

// Map icon types to actual icon components
const getIconComponent = (iconType?: string) => {
  switch (iconType) {
    case 'wallet':
      return <IconWallet />;
    case 'widgets':
      return <IconWidgets />;
    case 'time':
      return <IconTime />;
    case 'truck':
      return <IconTruck />;
    default:
      return <IconWallet />; // Default icon
  }
};

// Default features if none are provided
const defaultFeatures = [
  { text: "Лучшие цены", iconType: "wallet" },
  { text: "Широкий ассортимент", iconType: "widgets" },
  { text: "Бесплатный подбор 24/7", iconType: "time" },
  { text: "Удобная доставка", iconType: "truck" },
];

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface BuySectionProps {
  buySection?: BuySectionType;
}

const BuySection: React.FC<BuySectionProps> = ({
  buySection,
}) => {
  if (!buySection) {
    return null;
  }

  const { 
    title = "Где купить?", 
    description, 
    onlineTitle = "Онлайн", 
    distributor, 
    partners = [] 
  } = buySection;

  // Convert Lexical content to HTML
  const descriptionHtml = description ? lexicalToHtml(description) : "";
  
  // Setup distributor data with defaults
  const distributorData: DistributorType = {
    title: distributor?.title || "Официальный дистрибьютор HettAutomotive в России",
    website: distributor?.website || "protekauto.ru",
    websiteUrl: distributor?.websiteUrl || "https://protekauto.ru",
    image: distributor?.image,
    logo: distributor?.logo,
    buttonText: distributor?.buttonText || "Перейти на сайт",
    buttonUrl: distributor?.buttonUrl || "https://protekauto.ru",
    features: distributor?.features || [],
  };

  // Convert distributor features to component format with icons
  const mappedFeatures: Feature[] = (distributorData.features && distributorData.features.length > 0) 
    ? distributorData.features.map(feature => ({
        text: feature.text,
        icon: feature.iconType === 'custom' && feature.customIcon 
          ? <Image 
              src={feature.customIcon.url} 
              alt={feature.text}
              width={24} 
              height={24} 
            />
          : getIconComponent(feature.iconType)
      }))
    : defaultFeatures.map(feature => ({
        text: feature.text,
        icon: getIconComponent(feature.iconType)
      }));

  return (
    <section className="w-full py-[60px]">
      <Container>
        <h2 className="mb-8 text-[36px] font-extrabold text-black font-roboto-condensed leading-[1.1]">
          {title}
        </h2>

        {descriptionHtml && (
          <div
            className="mb-8 text-[16px] font-normal text-black font-roboto-condensed leading-[1.4]"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}

        {/* Official Distributor */}
        <div className="relative p-16 bg-white max-md:p-8 max-sm:p-5">
          <div className="flex flex-col md:flex-row items-start gap-10 max-w-full">
            <div className="max-w-[400px] max-md:max-w-full flex flex-col md:gap-[150px] gap-[50px] justify-between w-full h-full">
              <div>
                {distributorData.logo ? (
                  <Image 
                    src={distributorData.logo.url} 
                    alt={distributorData.website || "Distributor logo"} 
                    width={150} 
                    height={50}
                    className="mb-6 object-contain"
                  />
                ) : (
                  <Image src={logoMain} alt="logoMain" className="mb-6" />
                )}
                <Link
                  href={distributorData.websiteUrl || "https://protekauto.ru"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[22px] font-extrabold text-[#C00D0D] font-roboto-condensed leading-[1.1]"
                >
                  {distributorData.website}
                </Link>
              </div>
              <h3 className="text-[32px] font-extrabold text-black font-roboto-condensed leading-[1.1]">
                {distributorData.title}
              </h3>
            </div>

            <div className="flex-1 relative max-w-[500px]">
              {distributorData.image ? (
                <Image
                  src={distributorData.image.url}
                  alt="Distributor website interface"
                  className="w-full h-auto"
                  width={500}
                  height={400}
                  priority
                />
              ) : (
                <Image
                  src={protekWeb}
                  alt="Protek Auto website interface"
                  className="w-full h-auto"
                  priority
                />
              )}
            </div>

            <div className="w-[298px] max-md:w-full flex flex-col gap-3">
              {mappedFeatures.map((feature, index) => (
                <FeatureItem key={index} {...feature} />
              ))}
              <Button
                label={distributorData.buttonText || "Перейти на сайт"}
                href={distributorData.buttonUrl || "https://protekauto.ru"}
                variant="primary"
                className="w-[218px] h-[58px] text-[16px]"
              />
            </div>
          </div>
        </div>

        {/* Online Shops */}
        {partners && partners.length > 0 ? (
          <div className="mt-[60px]">
            <h3 className="font-roboto-condensed text-[32px] font-semibold leading-[1.1] text-black mb-[40px]">
              {onlineTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
              {partners.map((partner, index) => (
                <Link
                  key={index}
                  href={partner.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-5 bg-white p-[30px] hover:shadow-lg transition-shadow h-full justify-between"
                >
                  <div className="w-[60px] h-[60px] relative">
                    {partner.logo && (
                      <Image
                        src={partner.logo.url}
                        alt={partner.name}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-5">
                    <h4 className="font-roboto-condensed text-[16px] font-medium leading-[1.4]">
                      {partner.name}
                    </h4>
                    {partner.url && (
                      <p className="font-roboto-condensed text-[18px] text-[#38AE34]">
                        {partner.url.replace(/^https?:\/\//, "")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-[60px]">
            <h3 className="font-roboto-condensed text-[32px] font-semibold leading-[1.1] text-black mb-[40px]">
              {onlineTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
              {defaultShops.map((partner, index) => (
                <Link
                  key={index}
                  href={partner.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-5 bg-white p-[30px] hover:shadow-lg transition-shadow h-full justify-between"
                >
                  <div className="w-[60px] h-[60px] relative">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-5">
                    <h4 className="font-roboto-condensed text-[16px] font-medium leading-[1.4]">
                      {partner.name}
                    </h4>
                    {partner.url && (
                      <p className="font-roboto-condensed text-[18px] text-[#38AE34]">
                        {partner.url.replace(/^https?:\/\//, "")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default BuySection;
