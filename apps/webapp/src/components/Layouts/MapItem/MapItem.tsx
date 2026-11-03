import clsx from "clsx";
import { FC, useEffect, useRef } from "react";

interface MapItemProps {
  image: string;
  children: React.ReactNode;
  variant?: "Tickets" | "Themes" | "Courses";
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const MapItem: FC<MapItemProps> = ({
  children,
  image,
  isOpen,
  onToggle,
  className,
  variant,
}) => {
  const mapItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        mapItemRef.current &&
        !mapItemRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="w-full relative" ref={mapItemRef}>
      <img
        src={image}
        alt=""
        className={clsx(
          "cursor-pointer",
          {
            "map-item-img": variant === "Tickets" || variant === "Courses",
            "map-item-themes": variant === "Themes",
          },
          className
        )}
        onClick={onToggle}
      />
      {isOpen && (
        <div className="bg-[#D9E9FF] px-6 py-2 rounded-3xl absolute left-[-100px] w-[290px] top-12 z-10">
          {children}
        </div>
      )}
    </div>
  );
};
