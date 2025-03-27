"use client";

import React from "react";
import { Characteristic } from "../../types/product";

interface ProductCharacteristicsProps {
  characteristics: Characteristic[];
  oemNumber: string; // Required OEM number
}

const ProductCharacteristics: React.FC<ProductCharacteristicsProps> = ({
  characteristics,
  oemNumber,
}) => {
  // Combine OEM (which is always first and required) with other characteristics
  const allCharacteristics = [
    { label: "OEM №", value: oemNumber || "Н/Д" },
    ...characteristics,
  ];

  return (
    <>
      <div className="text-3xl font-extrabold font-[Roboto_Condensed] text-neutral-900 mb-6">
        Характеристики
      </div>
      <div className="flex flex-col gap-4 text-[16px] font-[Roboto_Condensed] text-neutral-900">
        {allCharacteristics.map((char, index) => (
          <div key={index} className="flex items-end gap-2 w-full">
            <span>{char.label}</span>
            <div className="flex-1 border-b border-dashed border-[#8898A4]"></div>
            <span className="text-right">{char.value}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductCharacteristics;
