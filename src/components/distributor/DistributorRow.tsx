import React from 'react';

export interface DistributorRowProps {
  name: string;
  website: string;
  url?: string;
  location?: string;
  locationUrl?: string; // Custom URL for location
}

export const DistributorRow: React.FC<DistributorRowProps> = ({ 
  name, 
  website, 
  url, 
  location, 
}) => {
  return (
    <div className="flex justify-between items-start px-8 py-5 w-full border-b border-solid border-neutral-200 max-md:px-5 max-md:py-4 max-sm:px-4 max-sm:py-2.5">
      <div className="text-[16px] leading-5 text-black w-[200px] max-md:w-[150px] max-sm:w-[100px] font-[Roboto_Condensed]">
        {name}
      </div>
      <div className="text-[16px] leading-5 w-[150px] max-md:w-[120px] max-sm:w-[90px] font-[Roboto_Condensed]">
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#38AE34]">
            {website}
          </a>
        ) : (
          <span className="text-[#38AE34]">{website}</span>
        )}
      </div>
      <div className="text-[16px] leading-5 font-[Roboto_Condensed]">
        {location ? (
          <a 
            href={location} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#38AE34]"
          >
            На карте
          </a>
        ) : (
          <span className="text-gray-400">Нет данных</span>
        )}
      </div>
    </div>
  );
};

export default DistributorRow; 