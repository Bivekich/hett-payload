import React from 'react';
import DistributorRow, { DistributorRowProps } from './DistributorRow';

interface DistributorsTableProps {
  distributors: DistributorRowProps[];
}

export const DistributorsTable: React.FC<DistributorsTableProps> = ({ distributors }) => {
  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex justify-between items-start px-8 py-5 w-full border-t border-b border-solid border-neutral-200 max-md:px-5 max-md:py-4 max-sm:px-4 max-sm:py-2.5">
        <div className="text-[16px] leading-5 text-stone-300 w-[200px] max-md:w-[150px] max-sm:w-[100px] font-[Roboto_Condensed]">
          Наименование
        </div>
        <div className="text-[16px] leading-5 text-stone-300 w-[150px] max-md:w-[120px] max-sm:w-[90px] font-[Roboto_Condensed]">
          Ссылка на сайт
        </div>
        <div className="text-[16px] leading-5 text-stone-300 font-[Roboto_Condensed]">
          Адрес
        </div>
      </div>
      {distributors.map((distributor, index) => (
        <DistributorRow key={index} {...distributor} />
      ))}
    </div>
  );
};

export default DistributorsTable; 