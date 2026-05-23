import { CSSProperties, ReactNode } from "react";

type TagVariant = "orange" | "green" | "blue" | "gray";

type TagNamesProps = {
  children: ReactNode;
  className?: string;
  variant?: TagVariant;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  rounded?: number | string;
  style?: CSSProperties;
};

const VARIANT_STYLES: Record<TagVariant, Pick<CSSProperties, "backgroundColor" | "color" | "borderColor">> = {
  orange: {
    backgroundColor: "#FFE2D6",
    color: "#9B3F00",
    borderColor: "#FFB490",
  },
  green: {
    backgroundColor: "#DCFCE7",
    color: "#166534",
    borderColor: "#86EFAC",
  },
  blue: {
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    borderColor: "#93C5FD",
  },
  gray: {
    backgroundColor: "#F3F4F6",
    color: "#374151",
    borderColor: "#D1D5DB",
  },
};

export default function TagNames({
  children,
  className = "",
  variant = "orange",
  bgColor,
  textColor,
  borderColor,
  rounded = "999px",
  style,
}: TagNamesProps) {
  const preset = VARIANT_STYLES[variant];

  const tagStyle: CSSProperties = {
    backgroundColor: bgColor ?? preset.backgroundColor,
    color: textColor ?? preset.color,
    borderColor: borderColor ?? preset.borderColor,
    borderRadius: rounded,
    ...style,
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1 text-sm font-jakarta font-semibold border ${className}`}
      style={tagStyle}
    >
      {children}
    </span>
  );
}