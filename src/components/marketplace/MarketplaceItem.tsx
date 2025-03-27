import React from 'react';

interface MarketplaceItemProps {
  name: string;
  link: string;
  url?: string;
}

const MarketplaceItem: React.FC<MarketplaceItemProps> = ({ name, link, url }) => {
  return (
    <div className="flex justify-between items-start px-8 py-5 w-full border-b border-solid border-b-neutral-200 max-md:px-5 max-md:py-4 max-sm:px-4 max-sm:py-3">
      <div className="text-[16px] leading-5 text-black w-[300px] max-sm:text-[16px] font-[Roboto_Condensed]">
        {name}
      </div>
      {url ? (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[16px] leading-5 text-[#38AE34] cursor-pointer max-sm:text-[16px] font-[Roboto_Condensed]"
        >
          {link}
        </a>
      ) : (
        <div className="text-[16px] leading-5 text-[#38AE34] cursor-pointer max-sm:text-[16px] font-[Roboto_Condensed]">
          {link}
        </div>
      )}
    </div>
  );
};

export default MarketplaceItem; 