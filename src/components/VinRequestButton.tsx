import React from "react";

const VinRequestButton: React.FC = () => {
  return (
    <button className="text-base font-medium text-black border border-green-600 border-solid cursor-pointer h-[42px] w-[200px] max-md:w-full">
      Запрос по VIN
    </button>
  );
};

export default VinRequestButton;
