import Image from "next/image";
import { CSSProperties, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  iconSrc?: string;
  iconAlt?: string;
  className?: string;
  variant?: "solid" | "gradient";
  bgColor?: string;
  textColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

export default function Button({
  children,
  iconSrc,
  iconAlt = "Icon",
  className = "",
  variant = "solid",
  bgColor = "#FFDAD2",
  textColor,
  gradientFrom = "#FF7A2C",
  gradientTo = "#9B3F00",
  width,
  height,
  style,
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const resolvedTextColor =
    textColor ?? (variant === "gradient" ? "#FFFFFF" : "#9B3F00");

  const buttonStyle: CSSProperties = {
    color: resolvedTextColor,
    width,
    height,
    ...(variant === "gradient"
      ? {
          backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }
      : { backgroundColor: bgColor }),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-4 justify-center px-14 py-6 rounded-full text-2xl font-jakarta font-bold cursor-pointer active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
      style={buttonStyle}
    >
      {iconSrc && (
        <Image
          className="mt-1"
          src={iconSrc}
          alt={iconAlt}
          width={22}
          height={22}
        />
      )}
      {children}
    </button>
  );
}
