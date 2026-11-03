import { FC } from "react";

interface NavbarIntermediateProps {
  className?: string;
  topContent?: React.ReactNode;
  children: React.ReactNode;
}

export const NavbarIntermediate: FC<NavbarIntermediateProps> = ({
  children,
  className,
  topContent,
}) => {
  return (
    <div
      className={`w-full text-white flex justify-between fixed ${
        top && "flex-col"
      } items-center h-30 px-4 ${className}`}
      style={{ borderRadius: "30px 30px 0 0" }}
    >
      {topContent ? (
        <>
          <div className="absolute bottom-20">{topContent}</div>
          <div className="w-full"></div>
          <div className="flex justify-between w-full bottom-8 relative">
            {children}
          </div>
        </>
      ) : (
        <div className={`${className}`}>{children}</div>
      )}
    </div>
  );
};
