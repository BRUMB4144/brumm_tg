import { Badge } from "@geist-ui/react";
import { FC } from "react";

interface TariffsCardMiniProps {
  cost: number;
  onClick?: () => void;
  discount?: number;
  fullPrice?: string;
  month: "oneMonth" | "halfYear" | "year"
  type: "standard" | "discount";
}

export const TariffsCardMini: FC<TariffsCardMiniProps> = ({
  cost,
  month,
  onClick,
  discount,
  fullPrice,
  type,
}) => {
  return (
    <div
      className="h-45 py-4 w-full px-4 bg-gray-200 rounded-2xl"
      onClick={onClick}
    >
      {type === "standard" ? (
        <div className="flex flex-col justify-between w-[130px] h-full ">
          <div className="flex flex-col gap-1">
            <p className="text-xl">{month == "oneMonth" ? "Месяц" : "Полгода"}</p>
            <p className="text-[var(--blueSecondary)] text-2xl">{cost} ₽</p>
          </div>
          <button className="py-2 px-2 rounded-lg bg-[var(--blueAccent)] text-white">
            Купить
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-between w-[130px] h-full ">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex w-full justify-between ">
              <p className="text-xl">На год</p>
              <Badge
                type="success"
                scale={1.3}
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  borderRadius: "4px",
                }}
              >
                -{discount}%
              </Badge>
            </div>
            <div className="flex flex-col">
              <p className="line-through text-gray-400">{fullPrice}</p>
              <p className="text-[var(--blueSecondary)] text-2xl">{cost} ₽</p>
            </div>
          </div>
          <button className="py-2 px-2 rounded-lg bg-[var(--blueAccent)] text-white">
            Купить
          </button>
        </div>
      )}
    </div>
  );
};
