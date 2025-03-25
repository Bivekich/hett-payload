"use client";

import React from "react";

interface DescriptionProps {
  text: string;
}

const Description: React.FC<DescriptionProps> = ({ text }) => {
  return (
    <>
      <div className="text-[28px] font-extrabold font-[Roboto_Condensed] text-black mb-4">
        Описание
      </div>
      <div className="text-[16px] whitespace-pre-line font-[Roboto_Condensed] text-black">
        {text}
      </div>
    </>
  );
};

export default Description;
