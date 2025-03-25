import React from "react";
import Image from "next/image";

// Default features data
const defaultFeatures = [
  {
    title: "Широкий ассортимент",
    description:
      "Hett Automotive стремится предоставлять своим клиентам качественные автозапчасти по доступным ценам",
    icon: "/images/about/wide-range-icon.svg",
  },
  {
    title: "Производство",
    description:
      "Hett Automotive стремится предоставлять своим клиентам качественные автозапчасти по доступным ценам",
    icon: "/images/about/production-icon.svg",
  },
  {
    title: "Гарантия",
    description:
      "Hett Automotive стремится предоставлять своим клиентам качественные автозапчасти по доступным ценам",
    icon: "/images/about/warranty-icon.svg",
  },
  {
    title: "Доставка",
    description:
      "Hett Automotive стремится предоставлять своим клиентам качественные автозапчасти по доступным ценам",
    icon: "/images/about/delivery-icon.svg",
  },
];

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesSectionProps {
  features?: Feature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features = defaultFeatures,
}) => {
  return (
    <section className="w-full pb-[60px] px-6 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[26px]">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-5 pb-[30px] flex flex-col gap-5"
          >
            <div className="w-[60px] h-[60px] bg-[#38AE34] rounded flex items-center justify-center">
              {feature.icon && (
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px]"
                />
              )}
            </div>
            <div className="flex flex-col gap-[30px]">
              <h3 className="font-roboto-condensed text-[20px] font-bold leading-[1.2]">
                {feature.title}
              </h3>
              <p className="font-roboto-condensed text-[16px] leading-[1.4] max-w-[260px]">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
