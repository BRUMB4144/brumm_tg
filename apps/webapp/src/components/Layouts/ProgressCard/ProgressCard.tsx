import { FC } from "react";

import { Progress } from "@radix-ui/themes";
import { CircleProgressBar } from "../CircleProgressBar/CircleProgressBar";

interface ProgressCardProps {
  title: string;
  percentage: number;
  questions?: number;
  themes?: number;
  onClick?: () => void;
  variant: "circle" | "linear";
  type?: "transparent" | "fill";
}
export const ProgressCard: FC<ProgressCardProps> = ({
  title,
  percentage,
  questions,
  themes,
  variant,
  onClick,
  type,
}) => {
  return (
    <>
      {variant === "linear" ? (
        <div
          className="flex flex-col items-start gap-2 w-full bg-[var(--blueLight)] px-3 py-2 rounded-2xl"
          onClick={onClick}
        >
          <p className="text-[var(--textSmall)]">{title}</p>
          <Progress value={percentage} size="2" />

          <div className="flex gap-1 items-center text-[var(--blueSecondary)]">
            <p className="text-[var(--textSmall)]">{questions} вопросов</p>/
            <p className="text-[var(--textSmall)]">{themes} тем</p>
          </div>
        </div>
      ) : (
        <div
          className={`${
            type === "transparent" ? "bg-[var(--purple)]" : "bg-gray-100"
          } bg-[var(--grayLight)] rounded-3xl flex items-center gap-2 px-3 py-1 w-full`}
          onClick={onClick}
        >
          <CircleProgressBar percentage={percentage} />
          <p
            className={`${
              type === "transparent" ? "text-gray-300" : "text-black"
            } text-md`}
          >
            {title}
          </p>
        </div>
      )}
    </>
  );
};
