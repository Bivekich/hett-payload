import React from "react";


export interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => {
  return (

    <div className="flex items-center mb-5 ">
      <div className="text-[#38AE34]">{icon}</div>
      <div className="ml-[10px] text-2xl text-black font-roboto-condensed">
        {text}
      </div>
    </div>
  );
};
