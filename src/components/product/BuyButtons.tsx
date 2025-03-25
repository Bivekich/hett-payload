"use client";

import React from "react";
import Button from "../uiKit/Button";
import wbLogo from "../../assets/wbLogo.svg";
import ozonLogo from "../../assets/ozonLogo.svg";
import Image from "next/image";
const BuyButtons: React.FC = () => {
  return (
    <div className="pb-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {/* Ozon Button */}
          <button className="border border-[#38AE34] flex items-center justify-center gap-4 px-6 py-4 hover:bg-gray-50 w-fit">
            <Image src={ozonLogo} alt="Ozon" width={92} height={24} />
            <span className="text-[16px] font-semibold font-[Roboto_Condensed]">
              Купить на ozon
            </span>
          </button>

          {/* Wildberries Button */}
          <button className="border border-[#38AE34] flex items-center justify-center gap-4 px-6 py-4 hover:bg-gray-50 w-fit">
            <Image src={wbLogo} alt="Wildberries" width={132} height={24} />
            <span className="text-[16px] font-semibold font-[Roboto_Condensed]">
              Купить на wildberries
            </span>
          </button>
        </div>

        {/* Additional Marketplace Buttons */}
        <div className="flex gap-4">
          <Button
            label="Все маркетплейсы"
            href="#"
            variant="primary"
            className="w-auto"
          />
          <Button
            label="Дистрибьюторы"
            href="#"
            variant="primary"
            className="w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default BuyButtons;
