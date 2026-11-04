import { FC } from "react";

interface ResultCardAnswersProps {
  right: number;
  total: number;
  children: React.ReactNode;
}

export const ResultCardAnswers: FC<ResultCardAnswersProps> = ({
  right,
  total,
  children,
}) => {
  return (
    <div className="bg-[#E0EEFF] rounded-2xl px-5 py-5 flex flex-col overflow-x-auto gap-3">
      <div className="flex w-full justify-between">
        <p>Ответы:</p>
        <div className="flex items-center w-full justify-end">
          <h2 className="text-[#47B355]">{right}</h2>
          <h2 className="text-[#6F6F6F]">/ {total}</h2>
        </div>
      </div>
      <div className="flex flex-nowrap gap-1 overflow-x-auto">{children}</div>
    </div>
  );
};
