import { FC } from "react";

import Crown from "../../../assets/whiteCrown.svg";
import { Border } from "../../ui/Border/Border";
import checkMark from "../../../assets/checkMark.svg";
import { Badge } from "@geist-ui/react";
import { useNavigate } from "react-router-dom";

interface TariffsCardProps {
  status: "Pro" | "Base";
  endAt?: string;
  autoRenew?: () => void;
  isAutoRenew: boolean;
}

export const TariffsCard: FC<TariffsCardProps> = ({
  status,
  endAt,
  isAutoRenew,
  autoRenew,
}) => {
  const navigate = useNavigate();
  const data = [
    { id: 1, img: checkMark, text: "Видео-разбор 40 билетов" },
    { id: 2, img: checkMark, text: "Разборы 800 вопросов" },
    { id: 3, img: checkMark, text: "Доступ к обучающим курсам" },
  ];

  const formatDate = (isoDate?: string): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="flex flex-col w-full bg-gray-100 rounded-2xl py-4 px-4">
      <div className="flex items-center justify-between w-full">
        <p className="text-lg">Мой тариф</p>
        {status === "Pro" ? (
          <>
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
              <p className="font-Gilroy-Bold mt-0.5 bg-transparent">PRO</p>
              <img src={Crown} alt={""} width={12} height={12} />
            </Badge>
          </>
        ) : (
          <Badge scale={1.3} type="secondary" style={{ borderRadius: "4px" }}>
            Базовый
          </Badge>
        )}
      </div>
      <Border />
      {status === "Pro" ? (
        <div className="flex flex-col items-start">
          <div className="w-full flex flex-col">
            <div className="flex justify-between w-full items-center gap-1">
              <p className="text-gray-500">
                Подписка активна <br /> до {formatDate(endAt)}
              </p>
              {isAutoRenew ? (
                <button
                  className="bg-transparent border-[1px] border-black rounded-3xl px-2 py-2 text-sm w-full"
                  onClick={autoRenew}
                >
                  Отменить автопродление
                </button>
              ) : (
                <div className="flex flex-col text-end">
                  <p className="text-gray-500">Автопродление отключено</p>
                  <p className="text-[#5C8EC6] active:text-gray-200 underline text-start">
                    Включить
                  </p>
                </div>
              )}
            </div>
            <Border />
          </div>
          <div className="flex flex-col">
            <p className="text-lg">Вам доступно:</p>
            {data.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <img src={item.img} alt={""} width={12} height={12} />
                <p className="text-[var(--blueSecondary)]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-flex-col">
          <div className="flex flex-col">
            <p className="text-lg">Оплатите подписку и получите:</p>
            {data.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <img src={item.img} alt={""} width={12} height={12} />
                <p className="text-[var(--blueSecondary)]">{item.text}</p>
              </div>
            ))}
          </div>

          <button
            className="mt-3 w-full bg-[var(--blueAccent)] px-2 py-2 text-white rounded-xl"
            onClick={() => navigate("/landing")}
          >
            Купить PRO
          </button>
        </div>
      )}
    </div>
  );
};
