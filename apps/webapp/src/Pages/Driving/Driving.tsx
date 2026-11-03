import wheel from "../../assets/steeringWheel.png";
import gameImg from "../../assets/Game/steeringWheel.png";
import Navigate from "../../assets/Navigate.svg";
import car from "../../assets/Reopen/car.png";

import Container from "../../components/Layouts/Container/Container";
import { Button } from "../../components/ui/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { Drawer } from "@geist-ui/react";
import { useEffect, useState } from "react";
import { ICourses } from "../../types/courses.types";
import { coursesService } from "../../services/courses.service";
import { Skeleton } from "@radix-ui/themes";
import { Notify } from "../../components/Layouts/Notyify/Notify";

export const Driving = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [courses, setCourses] = useState<ICourses[]>([]);

  useEffect(() => {
    const storedCount = localStorage.getItem("drivingGameCount");
    if (storedCount) {
      setCount(parseInt(storedCount, 10));
    }
    const fetchCourses = async () => {
      const response = await coursesService.fetchCourses();
      setCourses(response);
    };
    fetchCourses();
  }, []);

  const handleOpenGame = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("drivingGameCount", newCount.toString());

    if (newCount >= 2) {
      navigate("/driving/game");
    } else {
      setShowContent(true);
    }
  };
  const handleClick = () => {
    setShowContent(!showContent);
  };
  return (
    <Container>
      {/* <Notify /> */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col mt-4">
          <h1 className="top-5 relative text-2xl text-[#172942]">Вождение</h1>
          <div className="flex w-full justify-between items-center">
            <p className="w-full text-md text-[#172942]">
              Видеокурсы и игра-тренажер, которые помогут вам подготовиться к
              практике
            </p>
            <img
              src={wheel}
              alt={""}
              width={148}
              height={128}
              className="relative bottom-4"
            />
          </div>
        </div>
        <div
          className="bg-[var(--blueAccent)] w-full flex rounded-full justify-between items-center px-7 relative h-23"
          onClick={handleOpenGame}
        >
          <img
            src={gameImg}
            alt={""}
            width={150}
            height={128}
            className="absolute bottom-0 left-5 right-0"
          />
          <div className="bg-blue-200 blur-md opacity-20 h-30 w-30 absolute left-1/3 rounded-full"></div>
          <div></div>
          <div className="flex flex-col items-start text-start text-white ">
            <p className="text-lg">Тренажер вождения</p>
            <p className="text-md text-gray-200">запустить</p>
          </div>
        </div>
        <h1 className="text-xl text-[#172942]">
          Практические курсы и упражнения
        </h1>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/driving/city")}
            className="flex gap-2 rounded-full py-3 items-center"
            variant="Long"
          >
            <img src={Navigate} alt={""} width={32} height={12} />
            <p className="text-md">Экзаменационные маршруты</p>
          </Button>
        </div>
      </div>

      <Drawer
        visible={showContent}
        onClose={handleClick}
        placement="bottom"
        className="geist-ui-drawer"
        color="purple"
      >
        <Drawer.Content>
          <div className="flex flex-col items-center gap-5">
            <p className="w-70 text-center">
              При первом запуске игры загрузка может увеличиться до минуты.
              Дождитесь, пожалуйста.
            </p>

            <Button
              variant="outline"
              className="rounded-2xl border-white w-full py-4"
              onClick={() => navigate("/driving/game")}
            >
              Запустить тренажер
            </Button>
          </div>
        </Drawer.Content>
      </Drawer>

      <br />
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};
