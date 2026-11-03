import React, { FC } from "react";
import { Border } from "../../ui/Border/Border";

interface ResultCardProps {
  right: number;
  errors: number;
  skipped?: string;
  clue?: string;
}

export const ResultCard: FC<ResultCardProps> = ({
  right,
  errors,
  skipped,
  clue,
}) => {
  return (
    <div className="flex flex-col gap-1 text-black bg-[#F5F5F5] px-5 py-5 rounded-2xl">
      <div className="flex items-center justify-between w-full">
        <p>Правильных:</p>
        <p>{right}</p>
      </div>
      <Border />
      <div className="flex items-center justify-between w-full">
        <p>Ошибок:</p>
        <p>{errors}</p>
      </div>
      <Border />
      {skipped && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between w-full">
            <p>Пропущено:</p>
            <p>{skipped}</p>
          </div>
          <Border />
        </div>
      )}
      {clue && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full">
            <p>Открыто подсказок::</p>
            <p>{clue}</p>
          </div>
          <Border />
        </div>
      )}
    </div>
  );
};
