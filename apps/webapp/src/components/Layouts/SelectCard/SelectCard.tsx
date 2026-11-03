import { FC, useState } from "react";

import download from "../../../assets/Courses/download.svg";
import docs from "../../../assets/Courses/docs.svg";

interface SelectCard {
  description: string;
  fileName?: string;
  size?: string;
  onCLick?: () => void;
}

export const SelectCard: FC<SelectCard> = ({
  description,
  fileName,
  size,
  onCLick,
}) => {
  const [activeId, setActiveId] = useState<number | null>(0);

  return (
    <div className="w-full flex flex-col items-start">
      <div className="bg-white w-full rounded-full flex justify-between">
        <div
          className={`text-center rounded-full w-full py-2 cursor-pointer transition-all tracking-wider ${
            activeId === 0 ? "text-white bg-blue-300" : "text-black"
          }`}
          onClick={() => setActiveId(0)}
        >
          ОПИСАНИЕ
        </div>
        <div
          className={`text-center rounded-full w-full py-2 transition-all tracking-wider cursor-not-allowed ${
            activeId === 1 ? "text-white bg-blue-300" : "text-black"
          }`}
          // временно отключен
          // onClick={() => setActiveId(1)}
        >
          Файлы
        </div>
      </div>

      <div className="mt-4 w-full">
        {activeId === 0 && (
          <p className="text-black text-sm" style={{ whiteSpace: "pre-line" }}>
            {description}
          </p>
        )}

        {activeId === 1 && (
          <div className="w-full overflow-x-auto gap-2 max-w-30 bg-gray-100 rounded-lg px-2.5 py-2 relative">
            <div className="flex flex-col gap-1">
              <p className="text-sm">{fileName}</p>
              <p className="text-sm text-blue-300">{size}</p>
              <div
                className="flex w-full justify-between relative -bottom-2"
                onClick={onCLick}
              >
                <img src={docs} alt="" />
                <img src={download} width={24} alt="" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
