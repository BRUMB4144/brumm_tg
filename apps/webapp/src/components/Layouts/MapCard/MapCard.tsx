import { FC } from "react";

import Locator from "../../../assets/16/Locator.svg";

import Zoom from "../../../assets/18/zoom.svg";

interface MapCardProps {
  image: string;
  title: string;
  street: string;
  route: string;
}

export const MapCard: FC<MapCardProps> = ({ image, title, street, route }) => {
  return (
    <div className="w-full flex gap-4 p-1 bg-[var(--blueLight)] rounded-lg">
      <div className="relative">
        <img src={image} alt={""} width={133} height={102} />
        <div className="absolute top-1/4 flex items-center flex-col left-1/8 gap-1">
          <img src={Zoom} alt={""} width={24} height={20} />
          <p className="text-white font-semibold">{route} </p>
        </div>
      </div>
      <div className="h-auto flex flex-col justify-between py-2">
        <p className="font-semibold">{title}</p>
        <div className="flex gap-1">
          <img src={Locator} alt={""} width={12} height={12} />
          <p className="text-[var(--blueAccent)]">{street}</p>
        </div>
      </div>
    </div>
  );
};
