import React from 'react';

interface ContactInfoItemProps {
  title: string;
  subtitle: string;
  showMap?: boolean;
}

const ContactInfoItem: React.FC<ContactInfoItemProps> = ({ title, subtitle, showMap = false }) => {
  return (
    <div className="flex flex-col gap-2.5 justify-center items-start self-stretch max-sm:gap-2">
      <div className="text-xl font-bold leading-6 text-gray-400 max-md:text-lg max-sm:text-base">
        {title}
      </div>
      <div className="flex gap-2.5 items-start">
        <div className="text-base leading-5 text-slate-50 max-sm:text-sm">
          {subtitle}
        </div>
        {showMap && (
          <div className="text-base leading-5 text-green-600 cursor-pointer max-sm:text-sm" tabIndex={0} role="button">
            Показать на карте
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfoItem; 