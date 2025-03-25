import Image from "next/image";
import arrow from "@/assets/arrow.svg";

interface SliderButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const SliderButton = ({
  direction,
  onClick,
  className = "",
  ariaLabel,
  disabled = false,
}: SliderButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group flex items-center justify-center w-[82px] h-[45px] transition-colors
        ${
          disabled
            ? "bg-transparent border border-[#8898A4]"
            : "bg-white border border-transparent hover:border-[#38AE34] hover:border-2 active:bg-[#38AE34]"
        } 
        ${className}`}
      aria-label={
        ariaLabel || `${direction === "left" ? "Previous" : "Next"} slide`
      }
    >
      <Image
        src={arrow}
        alt={direction === "left" ? "Previous" : "Next"}
        width={24}
        height={24}
        className={`transform transition-all
          ${
            disabled
              ? "[filter:invert(56%)_sepia(10%)_saturate(676%)_hue-rotate(182deg)_brightness(91%)_contrast(86%)]"
              : "group-hover:[filter:invert(53%)_sepia(30%)_saturate(924%)_hue-rotate(93deg)_brightness(88%)_contrast(96%)] group-active:[filter:brightness(0)_invert(1)]"
          }
          ${direction === "left" ? "rotate-180" : ""}
        `}
      />
    </button>
  );
};

export default SliderButton;
