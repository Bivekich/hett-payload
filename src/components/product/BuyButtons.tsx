"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../uiKit/Button";
import wbLogo from "../../assets/wbLogo.svg";
import ozonLogo from "../../assets/ozonLogo.svg";
import Image from "next/image";

// Interface for marketplace data
interface Marketplace {
  name: string;
  url: string;
  logo?: string;
}

// Interface for distributor data
interface Distributor {
  name: string;
  url: string;
  location?: string;
}

interface BuyButtonsProps {
  ozonUrl?: string;
  wildberriesUrl?: string;
  marketplaces?: Marketplace[];
  distributors?: Distributor[];
}

// Popup component for marketplaces and distributors
interface PopupProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}
const Popup = React.forwardRef<HTMLDivElement, PopupProps>(({ title, onClose, children }, ref) => {
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-9999 flex items-center justify-center ">
      <div ref={ref} className="bg-white shadow-lg max-w-[580px] w-full max-h-[80vh] overflow-y-auto p-10 scale-85 md:scale-100 ">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center pb-10">
            <h3 className="text-[24px] md:text-[26px] font-bold font-[Roboto_Condensed] text-[#3B3B3B]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-black hover:text-[#38AE34] translate-x-4 -translate-y-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="">{children}</div>
      </div>
    </div>
  );
});
Popup.displayName = 'Popup';

const BuyButtons: React.FC<BuyButtonsProps> = ({
  ozonUrl,
  wildberriesUrl,
  marketplaces = [],
  distributors = [],
}) => {
  const [showMarketplaces, setShowMarketplaces] = useState(false);
  const [showDistributors, setShowDistributors] = useState(false);

  // Refs for Popups
  const marketplacePopupRef = useRef<HTMLDivElement>(null);
  const distributorPopupRef = useRef<HTMLDivElement>(null);

  // useEffect for Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close Distributors Popup
      if (
        distributorPopupRef.current &&
        !distributorPopupRef.current.contains(event.target as Node)
      ) {
        setShowDistributors(false);
      }
      // Close Marketplaces Popup
      if (
        marketplacePopupRef.current &&
        !marketplacePopupRef.current.contains(event.target as Node)
      ) {
        setShowMarketplaces(false);
      }
    };

    // Add listener if any popup is open
    if (showDistributors || showMarketplaces) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup listener on unmount or when popups close
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDistributors, showMarketplaces]);

  // Calculate if we have other marketplaces besides Ozon and Wildberries
  const hasOtherMarketplaces = marketplaces.length > 0;
  const hasDistributors = distributors.length > 0;

  return (
    <div className="pb-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {/* Ozon Button - Only show if URL is provided */}
          {ozonUrl && (
            <a
              href={ozonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#38AE34] flex items-center justify-center gap-4 px-6 py-4 hover:bg-gray-50 w-fit"
            >
              <Image
                src={ozonLogo}
                alt="Ozon"
                className="h-6 w-auto"
                width={60}
                height={24}
              />
              <span className="text-[16px] font-semibold font-[Roboto_Condensed]">
                Купить на ozon
              </span>
            </a>
          )}

          {/* Wildberries Button - Only show if URL is provided */}
          {wildberriesUrl && (
            <a
              href={wildberriesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#38AE34] flex items-center justify-center gap-4 px-6 py-4 hover:bg-gray-50 w-fit"
            >
              <Image
                src={wbLogo}
                alt="Wildberries"
                className="h-6 w-auto"
                width={60}
                height={24}
              />
              <span className="text-[16px] font-semibold font-[Roboto_Condensed]">
                Купить на wildberries
              </span>
            </a>
          )}
        </div>

        {/* Additional Marketplace and Distributor Buttons */}
        {(hasOtherMarketplaces || hasDistributors) && (
          <div className="flex gap-4 md:flex-row flex-col max-w-[200px] md:max-w-full">
            {hasOtherMarketplaces && (
              <Button
                label="Все маркетплейсы"
                onClick={() => setShowMarketplaces(true)}
                variant="primary"
                className="w-auto"
              />
            )}
            {hasDistributors && (
              <Button
                label="Дистрибьюторы"
                onClick={() => setShowDistributors(true)}
                variant="primary"
                className="w-auto"
              />
            )}
          </div>
        )}

        {/* Marketplaces Popup */}
        {showMarketplaces && (
          <Popup
            ref={marketplacePopupRef}
            title="Все маркетплейсы"
            onClose={() => setShowMarketplaces(false)}
          >
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] font-normal text-[#BFBFBF] tracking-wider"
                      >
                        Наименование маркетплейса
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] font-normal text-[#BFBFBF] tracking-wider w-[164px]"
                      >
                        Ссылка на сайт
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ozonUrl && (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-[16px] text-gray-900">
                          OZON
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#38AE34] text-right">
                          <a
                            href={ozonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            Купить
                          </a>
                        </td>
                      </tr>
                    )}
                    {wildberriesUrl && (
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-[16px] text-gray-900">
                          Wildberries
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#38AE34] text-right">
                          <a
                            href={wildberriesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            Купить
                          </a>
                        </td>
                      </tr>
                    )}
                    {marketplaces.map((marketplace, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-[16px] text-gray-900">
                          {marketplace.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#38AE34] text-right">
                          <a
                            href={marketplace.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            Купить
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Popup>
        )}

        {/* Distributors Popup */}
        {showDistributors && (
          <Popup
            ref={distributorPopupRef}
            title="Дистрибьюторы"
            onClose={() => setShowDistributors(false)}
          >
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] font-normal text-[#BFBFBF] tracking-wider max-md:text-[14px] max-md:px-3"
                      >
                        Наименование
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] font-normal text-[#BFBFBF] tracking-wider w-[164px] max-md:text-[14px] max-md:px-3 max-md:w-[100px]"
                      >
                        <span className="md:block hidden">Ссылка на сайт</span><span className="block md:hidden">Сайт</span>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-[16px] font-normal text-[#BFBFBF] tracking-wider max-md:text-[14px] max-md:px-3"
                      >
                        Адрес
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {distributors.map((distributor, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-[16px] text-gray-900 max-md:text-[14px] max-md:px-3">
                          {distributor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#38AE34] max-md:text-[14px] max-md:px-3">
                          <a
                            href={distributor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {
                              distributor.url
                                .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
                                .split("/")[0]
                            }
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#38AE34] max-md:text-[14px] max-md:px-3">
                          {distributor.location ? (
                            <a
                              href={distributor.location}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              На карте
                            </a>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
};

export default BuyButtons;
