import React from 'react';
import MarketplaceItem from './MarketplaceItem';
import CloseIcon from './CloseIcon';

interface Marketplace {
  name: string;
  link: string;
  url?: string;
}

interface MarketplaceListProps {
  marketplaces: Marketplace[];
  onClose?: () => void;
  title?: string;
}

const MarketplaceList: React.FC<MarketplaceListProps> = ({ 
  marketplaces = [], 
  onClose,
  title = "Все маркетплейсы"
}) => {
  return (
    <div className="flex relative flex-col gap-8 items-start p-16 bg-white w-[680px] max-md:p-10 max-md:w-full max-md:max-w-[680px] max-sm:px-5 max-sm:py-8 shadow-lg">
      <h1 className="text-[24px] font-bold leading-8 text-black max-sm:text-[24px] font-[Roboto_Condensed]">
        {title}
      </h1>
      <div className="flex flex-col items-start w-full">
        <div className="flex justify-between items-start px-8 py-5 w-full border-t border-b border-solid border-y-neutral-200 max-md:px-5 max-md:py-4 max-sm:px-4 max-sm:py-3">
          <div className="text-[16px] leading-5 text-stone-300 max-sm:text-[16px] font-[Roboto_Condensed]">
            Наименование маркетплейса
          </div>
          <div className="text-[16px] leading-5 text-stone-300 max-sm:text-[16px] font-[Roboto_Condensed]">
            Ссылка на сайт
          </div>
        </div>
        {marketplaces.map((marketplace, index) => (
          <MarketplaceItem 
            key={index} 
            name={marketplace.name} 
            link={marketplace.link} 
            url={marketplace.url}
          />
        ))}
      </div>
      <CloseIcon onClick={onClose} />
    </div>
  );
};

// Default marketplaces for example usage
export const defaultMarketplaces: Marketplace[] = [
  { name: 'OZON', link: 'Купить', url: 'https://ozon.ru' },
  { name: 'Wildberries', link: 'Купить', url: 'https://wildberries.ru' },
  { name: 'Яндекс Маркет', link: 'Купить', url: 'https://market.yandex.ru' },
  { name: 'Сбер Мега Маркет', link: 'Купить', url: 'https://sbermegamarket.ru' },
  { name: 'Autodoc.ru', link: 'Купить', url: 'https://autodoc.ru' },
  { name: 'ВсеИнструменты.ру', link: 'Купить', url: 'https://vseinstrumenti.ru' },
];

export default MarketplaceList; 