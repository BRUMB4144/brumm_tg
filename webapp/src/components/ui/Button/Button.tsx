import { FC } from "react";
import clsx from "clsx";

const getButtonStyles = (variant: IButton["variant"]): string => {
  switch (variant) {
    case "Big":
      return "pl-4 pr-6 py-2 bg-[var(--blueLight)]";
    case "Medium":
      return "px-4 py-3";
    case "Long":
      return "px-2 py-2 w-full gap-3 bg-[var(--blueLight)]";
    case "Mini":
      return "px-4 py-1.5 items-center";
    case "Icon":
      return "px-2 py-0 items-center";
    case "outline":
      return "px-2 py-2 items-center border-[0.5px] border-black rounded-full";
    default:
      return "px-4 py-2";
  }
};

interface IButton {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  Sellect?: boolean;
  variant?: "Big" | "Medium" | "Long" | "Mini" | "Icon" | "outline";
}

export const Button: FC<IButton> = ({
  children,
  className,
  variant,
  onClick,
  disabled,
}) => {
  return (
    <button
      className={clsx(getButtonStyles(variant), className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
