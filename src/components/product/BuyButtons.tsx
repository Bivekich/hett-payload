"use client";

import React, { useState } from "react";
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
const Popup: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center p-6">
            <h3 className="text-xl font-bold font-[Roboto_Condensed] text-[#3B3B3B]">{title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 bg-[#f8f9fa]">
          {children}
        </div>
      </div>
    </div>
  );
};

const BuyButtons: React.FC<BuyButtonsProps> = ({ 
  ozonUrl, 
  wildberriesUrl, 
  marketplaces = [], 
  distributors = [] 
}) => {
  const [showMarketplaces, setShowMarketplaces] = useState(false);
  const [showDistributors, setShowDistributors] = useState(false);

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
              <Image src={ozonLogo} alt="Ozon" className="h-6 w-auto" width={60} height={24} />
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
              <Image src={wbLogo} alt="Wildberries" className="h-6 w-auto" width={60} height={24} />
              <span className="text-[16px] font-semibold font-[Roboto_Condensed]">
                Купить на wildberries
              </span>
            </a>
          )}
        </div>

        {/* Additional Marketplace and Distributor Buttons */}
        {(hasOtherMarketplaces || hasDistributors) && (
          <div className="flex gap-4">
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
          <Popup title="Все маркетплейсы" onClose={() => setShowMarketplaces(false)}>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600 mb-4">Выберите маркетплейс для покупки товара:</p>
              <div className="grid grid-cols-1 gap-3">
                {ozonUrl && (
                  <a 
                    href={ozonUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-gray-200 bg-white hover:bg-gray-50 hover:border-[#38AE34] transition-colors"
                  >
                    <div className="w-16 flex items-center justify-center">
                      <Image src={ozonLogo} alt="Ozon" className="h-5 max-w-[60px] object-contain" width={60} height={20} />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-[#3B3B3B]">Ozon</span>
                      <p className="text-xs text-gray-500 mt-1">Официальный маркетплейс</p>
                    </div>
                    <div className="text-[#38AE34]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                )}
                {wildberriesUrl && (
                  <a 
                    href={wildberriesUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-gray-200 bg-white hover:bg-gray-50 hover:border-[#38AE34] transition-colors"
                  >
                    <div className="w-16 flex items-center justify-center">
                      <Image src={wbLogo} alt="Wildberries" className="h-5 max-w-[90px] object-contain" width={90} height={20} />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-[#3B3B3B]">Wildberries</span>
                      <p className="text-xs text-gray-500 mt-1">Официальный маркетплейс</p>
                    </div>
                    <div className="text-[#38AE34]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                )}
                {marketplaces.map((marketplace, index) => (
                  <a 
                    key={index}
                    href={marketplace.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-gray-200 bg-white hover:bg-gray-50 hover:border-[#38AE34] transition-colors"
                  >
                    <div className="w-16 flex items-center justify-center">
                      {marketplace.logo && marketplace.logo !== "" ? (
                        <Image 
                          src={marketplace.logo} 
                          alt={marketplace.name} 
                          className="h-5 max-w-[60px] object-contain"
                          width={60}
                          height={20}
                          unoptimized
                        />
                      ) : (
                        <div className="w-12 h-5 bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-[#3B3B3B]">{marketplace.name}</span>
                      <p className="text-xs text-gray-500 mt-1">Маркетплейс</p>
                    </div>
                    <div className="text-[#38AE34]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Popup>
        )}

        {/* Distributors Popup */}
        {showDistributors && (
          <Popup title="Дистрибьюторы" onClose={() => setShowDistributors(false)}>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600 mb-4">Выберите дистрибьютора для заказа товара:</p>
              <div className="grid grid-cols-1 gap-3">
                {distributors.map((distributor, index) => (
                  <a 
                    key={index}
                    href={distributor.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col p-4 border border-gray-200 bg-white hover:bg-gray-50 hover:border-[#38AE34] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#3B3B3B]">{distributor.name}</span>
                      <div className="text-[#38AE34]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    {distributor.location && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {distributor.location}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
};

export default BuyButtons;
