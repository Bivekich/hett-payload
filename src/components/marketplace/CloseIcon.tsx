import React from 'react';

interface CloseIconProps {
  onClick?: () => void;
}

const CloseIcon: React.FC<CloseIconProps> = ({ onClick }) => {
  return (
    <div 
      className="absolute right-8 top-8 cursor-pointer hover:opacity-70 transition-opacity max-md:right-6 max-md:top-6 max-sm:right-4 max-sm:top-4"
      onClick={onClick}
    >
      <svg 
        width="30" 
        height="30" 
        viewBox="0 0 30 30" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M8 23.75L6.25 22L13.25 15L6.25 8L8 6.25L15 13.25L22 6.25L23.75 8L16.75 15L23.75 22L22 23.75L15 16.75L8 23.75Z" 
          fill="black"
        />
      </svg>
    </div>
  );
};

export default CloseIcon; 