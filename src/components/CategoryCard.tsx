import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  title: string;
  iconSrc: string;
  href: string;
}

const CategoryCard = ({ title, iconSrc, href }: CategoryCardProps) => {
  return (
    <Link href={href} className="block">
      <div className="flex flex-col items-center bg-white p-5 h-full transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-center w-[100px] h-[100px] mb-5 bg-white rounded-full">
          <Image
            src={iconSrc}
            alt={title}
            width={50}
            height={50}
            className="object-contain"
          />
        </div>
        <h3 className="text-center text-[18px] font-medium roboto-condensed-medium text-black">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
