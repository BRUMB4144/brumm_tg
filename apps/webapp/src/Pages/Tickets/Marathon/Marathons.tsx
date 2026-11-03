import { NavbarIntermediate } from "../../../components/Modules/NavbarIntermediate";
import { Button } from "../../../components/ui/Button/Button";
import arrowBack from "../../../assets/16/arrowBack.svg";
import questions from "../../../assets/Tickets/Exam/question.svg";
import time from "../../../assets/Tickets/Exam/time.svg";
import vector from "../../../assets/Tickets/Exam/vector.svg";
import Polygon from "../../../assets/Tickets/Marathon/polygon.svg";
import { useNavigate } from "react-router-dom";
import { Progress } from "@geist-ui/react";
import Container from "../../../components/Layouts/Container/Container";
import { useEffect, useState } from "react";
import { examService } from "../../../services/exam.service";
import { Skeleton } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";

export const Marathons = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState<number>(0);
  // const [data, setData] = useState();
  const { data: data } = useQuery({
    queryKey: ["progress"],
    queryFn: examService.marathonProgress,
    staleTime: 10 * 60 * 1000, // 10 минут
  });
  // useEffect(() => {
  //   const progress = async () => {
  //     const response = await examService.marathonProgress();
  //     setData(response);
  //   };
  //   progress();
  // }, []);
  const handleStartMarathon = () => {
    if (active === 0) {
      navigate("/tickets/marathons/marathonFull");
    } else {
      navigate("/tickets/marathons/marathonNew");
    }
  };

  return (
    <>
      <Container>
        <br />
        <br />
        <div className="w-full flex items-center flex-col gap-y-4 text-center mt-5">
          <div className="flex flex-col gap-1 w-full items-center">
            <h1 className="text-2xl font-[500]">Марафон</h1>
            <p className="text-[var(--blueSecondary)] text-md">800 вопросов</p>
          </div>

          {data === undefined ? (
            <>
              <div className="flex flex-col gap-1 w-full items-center">
                <b className="text-md">Ваш прогресс</b>
                <div className="overflow-x-hidden rounded-3xl">
                  <Skeleton loading={true} width="500px" height="42px" />
                </div>
              </div>
              <div>
                <p>Загрузка прогресса...</p>{" "}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1 w-full items-center">
                <b className="text-md">Ваш прогресс</b>
                <Progress value={data.progress} height={4} type="success" />
              </div>
              <div>
                <p className="text-md">
                  {data.correctAnswers}% правильно решенных вопросов
                </p>
                <p className="text-md">{data.mistakes} ошибок</p>
              </div>
            </>
          )}
          <Button
            variant="outline"
            onClick={handleStartMarathon}
            className="w-full active:bg-gray-300 duration-300 py-4"
          >
            Старт
          </Button>
          <div className="flex w-full rounded-full border-[0.5px] border-black text-black h-15">
            <div
              className={`w-full h-15 flex justify-center items-center text-,d ${
                active == 0 && "bg-[#333C59] text-white rounded-full"
              }`}
              onClick={() => setActive(0)}
            >
              Все вопросы
            </div>
            <div
              className={`w-full h-15 flex justify-center items-center text-,d ${
                active == 1 && "bg-[#333C59] text-white rounded-full"
              }`}
              onClick={() => setActive(1)}
            >
              Только новые
            </div>
          </div>
          <div className="bg-[#E0EEFF] px-5 py-3 text-start rounded-3xl mt-2">
            {active === 1 ? (
              <div className="relative">
                <img
                  src={Polygon}
                  alt=""
                  className="absolute bottom-14 right-10"
                />
                <p>Уберем те вопросы, на которые вы уже ответили правильно</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={Polygon}
                  alt=""
                  className="absolute bottom-20 left-10"
                />
                <p>
                  Перемешаем все вопросы и вам будут попадаться те, на которые
                  вы уже ответили правильно
                </p>
              </div>
            )}
          </div>
          <br />
          <br />
          <br />
          <br />
        </div>
      </Container>
      <br />
      <br />
      <br />
      <br />
      <br />
      <NavbarIntermediate className="bg-[#4B46A4] bottom-0 w-full flex flex-col items-baseline py-3 px-0 gap-5 h-[30%]">
        <div className="flex items-center justify-between w-full">
          <Button
            className="bg-gray-600 rounded-full py-2 px-3"
            onClick={() => navigate("/tickets")}
            variant="Icon"
          >
            <img src={arrowBack} alt="Back" width={10} height={12} />
          </Button>
          <div className="flex flex-col">
            <p className="text-2xl text-center">Марафон вопросов</p>
          </div>
          <div></div>
        </div>
        <div className="flex w-full justify-between items-baseline pl-3 gap-4 text-sm">
          <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
            <img src={questions} alt="Questions" />
            <p>800 вопросов в случайном порядке</p>
          </div>
          <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
            <img src={vector} alt="Time" />
            <p>
              Можно выйти в любой момент, <br />
              результат сохранится
            </p>
          </div>
          <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
            <img src={time} alt="Vector" />
            <p>Время не ограничено</p>
          </div>
        </div>
      </NavbarIntermediate>
    </>
  );
};
