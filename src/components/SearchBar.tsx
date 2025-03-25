import React from "react";

const SearchBar: React.FC = () => {
  return (
    <div className="flex gap-2.5 items-center py-2.5 pr-44 pl-5 ml-80 bg-white border border-gray-400 border-solid w-[1060px] max-md:p-2.5 max-md:w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#555555]"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
      <input
        type="text"
        placeholder="Поиск по названию или артикулу"
        className="w-full text-base text-gray-400 border-[none]"
      />
    </div>
  );
};

export default SearchBar;
