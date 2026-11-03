import { NavbarIntermediate } from "../../../components/Modules/NavbarIntermediate";
import { useNavigate } from "react-router-dom";

import { Button } from "../../../components/ui/Button/Button";
import arrowBack from "../../../assets/16/arrowBack.svg";
import { useEffect, useState } from "react";
import { PathWay } from "../../../services/pathWay.service";
import { IPathWay } from "../../../types/pathWays.types";

export const City = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<IPathWay[]>([]);
  useEffect(() => {
    const fetchPathWays = async () => {
      const response = await PathWay.getPathWays();
      setData(response);
    };
    fetchPathWays();
  }, []);
  return (
    <div className="flex flex-col h-[100vh]">
      <div className="flex flex-col gap-6 px-8 py-15 mt-[80px]">
        {data.map((item) => (
          <p
            onClick={() => navigate(`/driving/city/${item._id}`)}
            className="text-lg"
          >
            {item.town}
          </p>
        ))}
      </div>
      <div
        className="px-[14px]"
        onClick={() => window.open("https://t.me/c/2326445497/225")}
      >
        <button className="w-full px-2 py-3 bg-[var(--blueLight)] rounded-full ">
          Упражнения на площадке ГАИ
        </button>
      </div>
      <NavbarIntermediate
        className={
          "bottom-0 bg-[#333C59] flex justify-between w-full mt-10 items-center"
        }
      >
        <Button
          className="bg-gray-600 rounded-full px-3 h-[44px] w-[44px] text-center flex items-center"
          onClick={() => navigate(-1)}
          variant={"Icon"}
        >
          <img src={arrowBack} alt="" width={14} />
        </Button>
        <p className="text-xl text-center">
          Экзаменационные <br />
          маршруты
        </p>
        <div className="pr-10"></div>
      </NavbarIntermediate>
    </div>
  );
};
