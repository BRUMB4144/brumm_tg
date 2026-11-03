import { FC } from "react";

import Play from "../../../assets/Reopen/play.png";
import Car from "../../../assets/Reopen/car.png";

export interface ReopenProps {
  onPlayClick?: () => void;
  onClick?: () => void;
  title: string;
}

export const Reopen: FC<ReopenProps> = ({ onPlayClick, onClick, title }) => {
  return (
    <div className="flex gap-2 w-full items-center border-[0.5px] border-[#415774] rounded-full px-4 py-2 active:bg-[#415774] duration-300">
      <img src={Play} alt={""} width={38} height={38} onClick={onPlayClick} />
      <img src={Car} alt={""} width={38} height={38} />

      <div className="flex items-start flex-col ">
        <p
          className="text-[#4D62FF]"
          style={{ fontSize: "var(--textSmall)" }}
          onClick={onClick}
        >
          Продолжить с последнего места
        </p>
        <p style={{ fontSize: "var(--textSmall)" }}>{title}</p>
      </div>
    </div>
  );
};
