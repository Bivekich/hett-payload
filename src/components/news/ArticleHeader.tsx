import React from "react";

interface ArticleHeaderProps {
  date: string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ date }) => {
  return (
    <div className="mb-8 text-[16px] leading-[1.4] text-[#38AE34] font-[Roboto_Condensed]">
      {date}
    </div>
  );
};

export default ArticleHeader;
