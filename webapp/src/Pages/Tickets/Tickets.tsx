import { useNavigate } from "react-router-dom";
import Container from "../../components/Layouts/Container/Container";
import { Button } from "../../components/ui/Button/Button";
import { ProgressCard } from "../../components/Layouts/ProgressCard/ProgressCard";
import RRD from "../../assets/Tickets/RRD.svg";
import Tests from "../../assets/Tickets/Tests.svg";
import Marathon from "../../assets/Tickets/Marathon.svg";
import Exams from "../../assets/Tickets/Exam.svg";

import offerImg from "../../assets/signs.png";
import { useEffect, useState } from "react";
import { userService } from "../../services/user.service";
import { Skeleton } from "@radix-ui/themes";
import { Drawer } from "@geist-ui/react";

import { useQuery } from "@tanstack/react-query";
import { VideoPlayer } from "../../components/Layouts/VideoPlayer/VideoPlayer";

export const Tickets = () => {
  // const [data, setData] = useState();
  // const [user, setUser] = useState<IProfile | undefined>(undefined);
  const [showContent, setShowContent] = useState<boolean>(false);
  const handleClick = () => {
    setShowContent(!showContent);
  };

  const navigate = useNavigate();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: userService.getProfile,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <>
      <Container>
        <div className="flex flex-col gap-5">
          <div className="flex w-full items-end justify-between">
            <div className="flex flex-col gap-y-4">
              <h1 className="text-2xl text-[#172942]">Билеты</h1>
              <p className="w-full text-[#172942] text-md">
                Видеокурсы, которые помогут вам изучить правила дорожного
                движения и подготовиться к экзаменам.
              </p>
            </div>
            <img src={offerImg} alt={""} width={148} height={128} />
          </div>
          {user === undefined ? (
            <div className="overflow-x-hidden rounded-3xl">
              <Skeleton loading={true} width="500px" height="80px" />
            </div>
          ) : (
            <ProgressCard
              title={"Ваша готовность к экзамену"}
              percentage={user?.progress.percentage ?? 0}
              variant={"circle"}
              type="fill"
              onClick={handleClick}
            />
          )}
          <div className="flex flex-col gap-3">
            <div className="flex items-center flex-row flex-wrap w-full justify-between gap-y-2">
              <div className="flex items-center w-full gap-2">
                <Button
                  onClick={() => navigate("/tickets/decide")}
                  className="flex flex-col h-35 justify-between rounded-3xl w-full"
                  variant="Big"
                >
                  <img src={RRD} alt={""} width={"42"} height={"0"} />
                  <p className="text-start text-md text-[#172942]">
                    Решать <br /> билеты ПДД
                  </p>
                </Button>
                <Button
                  onClick={() => navigate("/tickets/themes")}
                  className="flex flex-col h-35 justify-between rounded-3xl w-full"
                  variant="Big"
                >
                  <img src={Tests} alt={""} width={"42"} height={"0"} />
                  <p className="text-start text-md text-[#172942]">
                    Тесты <br /> по темам
                  </p>
                </Button>
              </div>
              <div className="flex items-center w-full gap-2">
                <Button
                  onClick={() => navigate("/tickets/marathons")}
                  className="flex flex-col h-35 justify-between rounded-3xl w-full"
                  variant="Big"
                >
                  <img src={Marathon} alt={""} width={"42"} height={"0"} />
                  <p className="text-start text-md text-[#172942]">
                    Марафон <br /> вопросов
                  </p>
                </Button>
                <Button
                  onClick={() => navigate("/tickets/exams")}
                  className="flex flex-col h-35 justify-between rounded-3xl w-full"
                  variant="Big"
                >
                  <img src={Exams} alt={""} width={"42"} height={"0"} />
                  <p className="text-start text-md text-[#172942]">
                    Тренировка <br /> экзамена
                  </p>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
      </Container>
      <Drawer
        visible={showContent}
        onClose={handleClick}
        placement="bottom"
        className="geist-ui-drawer"
        color="purple"
      >
        <Drawer.Title className="geist-ui-drawer-title">
          Статистика
        </Drawer.Title>

        <Drawer.Content>
          <div className="flex flex-col items-start">
            <ProgressCard
              title={"Ваша готовность к экзамену"}
              percentage={user?.progress.percentage ?? 0}
              variant={"circle"}
              onClick={handleClick}
              type="transparent"
            />
            <br />
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-0.5">
                  <p>Тестов пройдено</p>
                  <p>{user?.progress.ticketsCompleted ?? 0}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p>Уроков пройдено</p>
                  <p>{user?.progress.lessonsCompleted ?? 0}</p>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <p>Ошибок</p>
                <b className="text-red-500">{user?.progress.mistakes}%</b>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer>
    </>
  );
};
