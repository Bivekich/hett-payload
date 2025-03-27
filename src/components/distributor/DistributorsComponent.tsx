import React from 'react';
import DistributorsTable from './DistributorsTable';
import CloseButton from './CloseButton';
import { DistributorRowProps } from './DistributorRow';

interface DistributorsComponentProps {
  distributors: DistributorRowProps[];
  onClose?: () => void;
  title?: string;
}

export const DistributorsComponent: React.FC<DistributorsComponentProps> = ({
  distributors,
  onClose,
  title = "Дистрибьюторы"
}) => {
  return (
    <div className="flex relative flex-col gap-8 items-start p-16 bg-white w-[680px] max-md:p-10 max-md:w-full max-md:max-w-[680px] max-sm:px-5 max-sm:py-8 shadow-lg">
      <h1 className="text-[24px] font-bold leading-8 text-black max-sm:text-[24px] font-[Roboto_Condensed]">
        {title}
      </h1>
      <DistributorsTable distributors={distributors} />
      <CloseButton onClick={onClose || (() => {})} />
    </div>
  );
};

// Default distributors for example usage
export const defaultDistributors: DistributorRowProps[] = [
  { 
    name: "Авто-Евро", 
    website: "autoeuro.ru", 
    url: "https://autoeuro.ru", 
    location: "Москва, ул. Автомобильная, 1",
    locationUrl: "https://yandex.ru/maps/213/moscow/search/Москва,%20ул.%20Автомобильная,%201" 
  },
  { 
    name: "Emex", 
    website: "emex.ru", 
    url: "https://emex.ru", 
    location: "Санкт-Петербург, пр. Запчастей, 2",
    locationUrl: "https://yandex.ru/maps/2/saint-petersburg/search/Санкт-Петербург,%20пр.%20Запчастей,%202"
  },
  { 
    name: "АдеоПро", 
    website: "adeopro.ru", 
    url: "https://adeopro.ru", 
    location: "Новосибирск, ул. Деталей, 3",
    locationUrl: "https://yandex.ru/maps/65/novosibirsk/search/Новосибирск,%20ул.%20Деталей,%203"
  },
  { 
    name: "STParts", 
    website: "stparts.ru", 
    url: "https://stparts.ru", 
    location: "Екатеринбург, пр. Автозапчастей, 4",
    locationUrl: "https://yandex.ru/maps/54/yekaterinburg/search/Екатеринбург,%20пр.%20Автозапчастей,%204"
  },
  { 
    name: "Froza", 
    website: "froza.ru", 
    url: "https://froza.ru", 
    location: "Казань, ул. Ремонтная, 5",
    locationUrl: "https://yandex.ru/maps/43/kazan/search/Казань,%20ул.%20Ремонтная,%205"
  },
  { 
    name: "ABSEL", 
    website: "absel.ru", 
    url: "https://absel.ru", 
    location: "Нижний Новгород, пр. Автомобилистов, 6",
    locationUrl: "https://yandex.ru/maps/47/nizhny-novgorod/search/Нижний%20Новгород,%20пр.%20Автомобилистов,%206"
  },
  { 
    name: "AVD", 
    website: "avdmotors.ru", 
    url: "https://avdmotors.ru", 
    location: "Ростов-на-Дону, ул. Моторная, 7",
    locationUrl: "https://yandex.ru/maps/39/rostov-na-donu/search/Ростов-на-Дону,%20ул.%20Моторная,%207"
  },
];

export default DistributorsComponent; 