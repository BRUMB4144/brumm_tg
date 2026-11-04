import { FC } from "react";
import Error from "../../../assets/Tickets/Error/Vector.svg";
import Right from "../../../assets/Tickets/Error/right.svg";
import comment from "../../../assets/16/message.svg";
import { Collapse } from "@geist-ui/react";

interface ErrorCardProps {
  img: string;
  title: string;
  error: string;
  right: string;
  analysis: string;
}

export const ErrorCard: FC<ErrorCardProps> = ({
  img,
  title,
  error,
  right,
  analysis,
}) => {
  return (
    <div className="flex flex-col bg-[#E0EEFF] gap-4 px-3 py-4 rounded-2xl">
      <div className="flex w-full gap-3">
        {img && (
          <img
            src={img}
            width={120}
            height={70}
            alt=""
            className="rounded-xl flex shrink-0"
          />
        )}
        <p className="text-lg">{title}</p>
      </div>
      <div className="flex flex-col text-[#E96847] gap-2">
        <div className="flex gap-2 items-center">
          <img src={Error} width={16} alt="" />
          <p>Ваш ответ:</p>
        </div>
        <div className="border-1 border-[#E96847] flex items-start px-4 py-4 rounded-xl">
          {error}
        </div>
      </div>
      <div className="flex flex-col text-[#333C59] gap-2">
        <div className="flex gap-2 items-center">
          <img src={Right} width={16} alt="" />
          <p>Правильный ответ:</p>
        </div>
        <div className="border-1 border-[#333C59] flex items-start px-4 py-4 rounded-xl">
          {right}
        </div>
      </div>
      <Collapse.Group>
        <Collapse className="border-unset" title="Разбор вопроса">
          <p>{analysis}</p>
        </Collapse>
      </Collapse.Group>
    </div>
  );
};
