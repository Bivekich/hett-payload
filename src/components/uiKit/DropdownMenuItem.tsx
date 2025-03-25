import Link from "next/link";

interface DropdownMenuItemProps {
  text: string;
  href?: string;
}

const DropdownMenuItem = ({ text, href = "#" }: DropdownMenuItemProps) => {
  return (
    <Link
      href={href}
      className="flex items-center px-5 py-2 text-sm font-medium text-[#555555] hover:text-[#38AE34] transition-colors roboto-condensed-medium"
    >
      {text}
    </Link>
  );
};

export default DropdownMenuItem;
