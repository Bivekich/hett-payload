import Image from "next/image";
import Link from "next/link";
import arrow from "@/assets/arrow_right.svg";
import arrowBlack from "@/assets/arrowBlack.svg";

interface ButtonProps {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "noArrow" | "noArrow2";
  className?: string;
  hideArrow?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  label,
  href,
  variant = "primary",
  className = "",
  hideArrow = false,
  disabled = false,
  onClick,
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center gap-2 whitespace-nowrap font-semibold roboto-condensed-semibold group text-sm flex justify-center items-center";

  const variantStyles = {
    primary:
      "bg-[#38AE34] text-white py-[10px] px-[25px] hover:bg-transparent hover:text-black border border-transparent hover:border-[#38AE34]",
    secondary:
      "bg-[#38AE34] text-white py-[10px] px-[25px] hover:bg-transparent hover:text-white border border-transparent hover:border-[#38AE34]",
    outline:
      "border border-[#38AE34] text-[#38AE34] py-[10px] px-[25px] hover:bg-[#38AE34] hover:text-white",
    noArrow:
      "h-[42px] px-10 font-medium text-sm leading-tight text-center border border-[#38AE34] roboto-condensed-medium hover:bg-[#38AE34] hover:text-white",
    noArrow2:
      "h-[42px] px-10 font-medium text-sm leading-tight bg-[#38AE34] text-white text-center border border-[#38AE34] roboto-condensed-medium hover:bg-transparent hover:text-[#38AE34]",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed hover:bg-[#38AE34] hover:text-white hover:border-transparent";

  const renderArrows = () => {
    if (hideArrow || variant === "noArrow" || variant === "noArrow2")
      return null;

    return (
      <>
        <Image
          src={arrow}
          alt="→"
          width={16}
          height={16}
          className={`inline-block w-4 h-4 ${
            variant === "primary" && !disabled ? "group-hover:hidden" : ""
          }`}
        />
        <Image
          src={arrowBlack}
          alt="→"
          width={16}
          height={16}
          className={`${
            variant === "primary" && !disabled ? "hidden group-hover:inline-block" : "hidden"
          }`}
        />
      </>
    );
  };

  // If href is provided and button is not disabled, render as Link
  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {label}
        {renderArrows()}
      </Link>
    );
  }

  // If href is provided but button is disabled, render as button that looks like a link but doesn't navigate
  if (href && disabled) {
    return (
      <button
        disabled={true}
        className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      >
        {label}
        {renderArrows()}
      </button>
    );
  }

  // Otherwise render as button
  return (
    <button
      onClick={onClick}
      type="submit"
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : ''} ${className}`}
    >
      {label}
      {renderArrows()}
    </button>
  );
};

export default Button;
