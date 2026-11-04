import { reportRequestError } from '../../../lib/requestError';
import { useEffect, useState } from "react";
import { MapItem } from "../../../components/Layouts/MapItem/MapItem";
import { NavbarIntermediate } from "../../../components/Modules/NavbarIntermediate";
import { Button } from "../../../components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { Loading } from "@geist-ui/react";
import arrowBack from "../../../assets/16/arrowBack.svg";

import Route from "../../../assets/Map/map1.png";
import Route2 from "../../../assets/Map/map4.png";
import questions from "../../../assets/Tickets/Exam/question.svg";
import time from "../../../assets/Tickets/Exam/time.svg";
import vector from "../../../assets/Tickets/Exam/vector.svg";
import { ticketsService } from "../../../services/tickets.service";
import { ThemesItems } from "../../../types/tickets.types";
import {
  positionsMD,
  positionsSM,
  positionsPRO,
  positions360,
  positions370,
  positions380,
  positions390,
  positions395,
  positions400,
  positions405,
  positions410,
  positions415,
  positions420,
  positions425,
  positions430,
  positions440,
} from "../../../constants/data.constants";

import thumbUp from "../../../assets/Map/Signs/amin.svg";
import bbc from "../../../assets/Map/Signs/bbc.svg";
import car from "../../../assets/Map/Signs/car.svg";
import crossroad from "../../../assets/Map/Signs/crossRoad.svg";
import fix from "../../../assets/Map/Signs/fix.svg";
import fork from "../../../assets/Map/Signs/fork.svg";
import road from "../../../assets/Map/Signs/road.svg";
import guarded from "../../../assets/Map/Signs/guarded.svg";
import law from "../../../assets/Map/Signs/law.svg";
import maxSpeed from "../../../assets/Map/Signs/maxSpeed.svg";
import oncomingTraffic from "../../../assets/Map/Signs/oncomingTraffic.svg";
import pedestrianCrossing from "../../../assets/Map/Signs/pedestrianCrossing.svg";
import rci from "../../../assets/Map/Signs/rci.svg";
import stop from "../../../assets/Map/Signs/stop.svg";
import success from "../../../assets/Map/Signs/success.svg";
import trafficLight from "../../../assets/Map/Signs/trafficLight.svg";
import wheel from "../../../assets/Map/Signs/wheel.svg";

import buildings from "../../../assets/Map/buildings.svg";
import buildings2 from "../../../assets/Map/buildings2.svg";
import city from "../../../assets/Map/city.svg";
import forward from "../../../assets/Map/forward.svg";
import fuel from "../../../assets/Map/fuel.svg";
import giveWay from "../../../assets/Map/giveWay.svg";

import trafficLight1 from "../../../assets/Map/trafficLight.svg";
import { MEDIA_URL } from "../../../config";

const getThemeImage = (name: string) => {
  switch (name) {
    case "Общие положения":
      return law; // Законы и правила
    case "Предупреждающие знаки":
      return rci; // Предупреждающие знаки
    case "Остановка":
      return stop; // Знак остановки
    case "Предписывающие знаки":
      return bbc; // Предписывающие знаки
    case "Дорожная разметка":
      return road; // Дорожная разметка
    case "Светофор и регулировщик":
      return trafficLight; // Светофор
    case "Сигналы поворота":
      return car; // Автомобиль (сигналы)
    case "Разворот":
      return fork; // Развилка/поворот
    case "Скорость движения":
      return maxSpeed; // Ограничение скорости
    case "Обгон. Опережение. Встречный разъезд":
      return oncomingTraffic; // Встречный разъезд
    case "Стоянка":
      return stop; // Остановка/стоянка
    case "Проезд равнозначного перекрестка":
      return crossroad; // Перекресток
    case "Знаки Таблички":
      return guarded; // Таблички как знаки
    case "Перевозка людей и грузов":
      return car; // Автомобиль (перевозка)
    case "Неисправности и запрет":
      return fix; // Ремонт/неисправности
    case "Основы безопасности":
      return success; // Безопасность
    case "Знаки Приоритета":
      return bbc; // Приоритетные знаки
    case "Запрещающие знаки":
      return stop; // Запрещающие знаки
    case "Знаки Особых предписаний":
      return bbc; // Особые предписания
    case "Перестроение":
      return car; // Маневры автомобиля
    case "Расположение ТС":
      return road; // Положение на дороге
    case "Проезд неравнозначного перекрестка":
      return crossroad; // Перекресток
    case "Специальные режимы движения":
      return maxSpeed; // Режимы скорости
    case "Буксировка":
      return car; // Автомобиль (буксировка)
    case "Медицина":
      return thumbUp; // Положительный символ (медицина)
    case "Специальные сигналы":
      return trafficLight; // Сигналы
    case "Повороты":
      return fork; // Повороты
    case "Фары и сигнал":
      return car; // Автомобиль (фары)
    case "Пешеходные переходы, остановки и приоритет МТС":
      return pedestrianCrossing; // Пешеходный переход
    case "Мопеды":
      return wheel; // Колесо (мопед)
    case "Обязанности водителей":
      return law; // Законы для водителей
    case "Информационные знаки и знаки Сервиса":
      return rci; // Информационные знаки
    case "Движение задним ходом":
      return car; // Автомобиль (задний ход)
    case "Юридическая ответственность":
      return law; // Юридические законы
    case "Аварийная сигнализация":
      return car; // Автомобиль (сигналы)
    case "Запрещающие знак":
      return stop; // Запрещающие знаки
    case "Информационные знаки и знаки Сервиса\n":
      return rci; // Информационные знаки
    default:
      return stop; // Fallback-изображение
  }
};

export const Themes = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<ThemesItems[]>([]);
  const [progress, setProgress] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [positions, setPositions] = useState(positionsMD);

  const handleStart = async (category: string) => {
    try {
      await ticketsService.startTicketsTheme(category);
      navigate(`../../tickets/themes/${category}`);
    } catch (error) { reportRequestError(error); }
  };

  useEffect(() => {
    const positionRanges = [
      { minWidth: 360, maxWidth: 370, positions: positions360 },
      { minWidth: 370, maxWidth: 380, positions: positions370 },
      { minWidth: 380, maxWidth: 390, positions: positions380 },
      { minWidth: 390, maxWidth: 395, positions: positions390 },
      { minWidth: 390, maxWidth: 395, positions: positions390 },
      { minWidth: 390, maxWidth: 395, positions: positions390 },
      { minWidth: 395, maxWidth: 400, positions: positions395 },
      { minWidth: 400, maxWidth: 405, positions: positions400 },
      { minWidth: 405, maxWidth: 410, positions: positions405 },
      { minWidth: 410, maxWidth: 415, positions: positions410 },
      { minWidth: 415, maxWidth: 420, positions: positions415 },
      { minWidth: 420, maxWidth: 425, positions: positions420 },
      { minWidth: 425, maxWidth: 430, positions: positions425 },
      { minWidth: 430, maxWidth: 435, positions: positions430 },
      { minWidth: 440, maxWidth: Infinity, positions: positions440 },
    ];

    const handleResize = () => {
      const width = window.innerWidth;
      const matchedRange = positionRanges.find(
        (range) => width >= range.minWidth && width < range.maxWidth
      );
      const newPositions = matchedRange ? matchedRange.positions : positionsMD;
      setPositions(newPositions);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {}, [positions]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setIsLoading(true);
        const response = await ticketsService.fetchThemes();
        setTickets(response);
        setTimeout(() => {
          const lastElement = document.getElementById("lastElement");
          if (lastElement) {
            lastElement.scrollIntoView({ behavior: "smooth" });
          }
        }, 1200);
      } catch {
        setIsLoading(true);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchProgress = async () => {
      try {
        const response = await ticketsService.progressThemes();
        setProgress(response);
      } catch (error) { reportRequestError(error); }
    };
    fetchThemes();
    fetchProgress();
  }, []);

  const handleToggle = (themeId: string) => {
    setOpenItemId(openItemId === themeId ? null : themeId);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loading type="secondary" />
        </div>
      ) : (
        <div className="bg-gray-100 flex items-center justify-center flex-col min-h-screen relative overflow-hidden">
          <img
            src={Route}
            alt="Дорожный маршрут"
            className="w-1/2 relative z-0"
          />

          <img
            src={buildings}
            className="-right-41 bottom-0 absolute buildingT "
            alt=""
          />
          <img
            src={buildings2}
            className="-bottom-110 -left-50 absolute buildingT2 "
            alt=""
          />
          <img
            src={buildings}
            className="-right-41 -top-200 absolute buildingT3"
            alt=""
          />
          <img
            src={buildings2}
            className="-top-160 -left-54 absolute buildingT4"
            alt=""
          />
          <img
            src={city}
            className="top-7 right-0 left-32.5 absolute z-0"
            alt=""
          />
          <img
            src={forward}
            className="top-148 right-0 left-64 absolute z-0"
            alt=""
          />
          <img
            src={fuel}
            className="top-347 right-0 left-32.5 absolute z-0"
            alt=""
          />
          <img
            src={giveWay}
            className="top-430 right-0 left-64 absolute z-0"
            alt=""
          />
          <img
            src={trafficLight1}
            className="top-517 right-0 left-32.5 absolute z-0"
            alt=""
          />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />

          {tickets.map((theme, index) => {
            const position = positions[index] || {
              top: "top-0",
              left: "left-0",
            };

            const themeId = theme.id || theme.name;
            const thumbnailUrl = theme.thumbnail
              ? `${MEDIA_URL}${theme.thumbnail}`
              : getThemeImage(theme.name);

            return (
              <div
                key={index}
                className={`absolute ${position.top} ${position.left}`}
              >
                <MapItem
                  image={thumbnailUrl}
                  isOpen={openItemId === themeId}
                  onToggle={() => handleToggle(themeId)}
                  variant="Themes"
                  className="min-w-[60px]"
                >
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="font-[500]">{theme.name}</p>
                      <p>Вопросов: {theme.questions}</p>
                    </div>
                    <Button
                      className="bg-[#4B46A4] w-full rounded-3xl text-white"
                      onClick={() => handleStart(themeId)}
                    >
                      Начать
                    </Button>
                  </div>
                </MapItem>
              </div>
            );
          })}

          <NavbarIntermediate className="bg-[#4B46A4] bottom-0 w-full flex flex-col items-baseline py-3 px-0 gap-5 h-[30%] navbar">
            <div className="flex items-center justify-between w-full">
              <Button
                className="bg-gray-600 rounded-full py-2 px-3"
                onClick={() => navigate("/tickets")}
                variant="Icon"
              >
                <img src={arrowBack} alt="Back" width={10} height={12} />
              </Button>
              <div className="flex flex-col">
                <p className="text-2xl text-center">Вопросы по темам</p>
              </div>
              <div></div>
            </div>
            <div className="flex w-full justify-between items-baseline pl-3 gap-4 text-sm">
              <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
                <img src={questions} alt="Questions" />
                <p>Есть подсказки и разборы</p>
              </div>
              <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
                <img src={vector} alt="Time" />
                <p>
                  Можно <br /> ошибаться
                </p>
              </div>
              <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
                <img src={time} alt="Vector" />
                <p>Время не ограничено</p>
              </div>
            </div>
            <p className="text-[#5C8EC6] text-center">
              Подходит для обучения и подготовки к экзамену
            </p>
          </NavbarIntermediate>
        </div>
      )}
      <div id="lastElement"></div>
    </>
  );
};
