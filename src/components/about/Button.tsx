import React from "react";

interface ButtonProps {
  text: string;
  link: string;
}

export const Button: React.FC<ButtonProps> = ({ text, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center px-[30px] py-[14px] text-[18px] font-semibold text-white no-underline bg-[#38AE34] w-fit hover:bg-opacity-90 transition-colors"
    >
      <span className="font-roboto-condensed leading-[1.2]">{text}</span>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ml-2"
      >
        <path
          d="M13.8333 8.625L18 13M18 13L13.8333 17.375M18 13L8 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};
