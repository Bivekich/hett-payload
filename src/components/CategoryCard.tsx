import Image from "next/image";

interface CategoryCardProps {
  title: string;
  iconSrc: string;
  href?: string; // Make href optional since we won't be using it
}

const CategoryCard = ({ title, iconSrc }: CategoryCardProps) => {
  return (
    <div className="flex flex-col items-center bg-white p-5 h-full transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-center w-[100px] h-[100px] mb-5 bg-white rounded-full">
        <Image
          src={iconSrc}
          alt={title}
          width={80}
          height={80}
          className="object-contain"
          unoptimized
          priority
        />
      </div>
      <h3 className="text-center text-[18px] font-medium roboto-condensed-medium text-black">
        {title}
      </h3>
    </div>
  );
};

export default CategoryCard;
