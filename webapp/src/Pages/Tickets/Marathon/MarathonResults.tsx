import Container from "../../../components/Layouts/Container/Container";
import clock from "../../../assets/Tickets/Results/Clock.svg";
import { ResultCardAnswers } from "../../../components/Layouts/ResultCard/ResultCardAnswers";
import { ResultCard } from "../../../components/Layouts/ResultCard/ResultCard";
import { Button } from "../../../components/ui/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { examService } from "../../../services/exam.service";
import { MarathonResult } from "../../../types/marathon.types";

export const MarathonResults = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MarathonResult | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const progress = async () => {
      if (!id) {
        console.error("ID не предоставлен");
        return;
      }
      try {
        const result = await examService.marathonResult(id);
        setData(result);
        console.log("Marathon result:", result);
      } catch (error) {
        console.error("Failed to fetch marathon result:", error);
      }
    };
    progress();
  }, [id]);

  const handleShare = async () => {
    if (!data) {
      console.error("Данные еще не загружены");
      navigate(`/tickets/marathons/${id}/results/share`);
      return;
    }
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const user = webApp.initDataUnsafe?.user;
      const hasPremium = user?.is_premium || false;

      if (hasPremium) {
        try {
          const response = await examService.shareStory(
            shareResult.correct,
            shareResult.mistakes,
            shareResult.time,
            shareResult.type
          );

          if (
            response?.status &&
            typeof response.imageUrl === "string" &&
            response.imageUrl.startsWith("http")
          ) {
            console.log("imageUrl:", response.imageUrl);
            webApp.shareToStory(response.imageUrl, {
              text: "Пройди тоже симулятор экзамена ГАИ по теории в GuseffGo: @GuseffGo",
              widget_link: { url: "@GuseffGo", name: "Запустить" },
            });
          } else {
            console.error("Неверный формат URL изображения:", response);
            navigate(`/tickets/marathons/${id}/results/share`);
          }
        } catch (error) {
          console.error("Ошибка при попытке поделиться в истории:", error);
          navigate(`/tickets/marathons/${id}/results/share`);
        }
      } else {
        navigate(`/tickets/marathons/${id}/results/share`);
      }
    } else {
      console.error("Telegram WebApp недоступен");
      navigate(`/tickets/marathons/${id}/results/share`);
    }
  };

  const shareResult = data
    ? {
        correct: String(data.correctAnsweredQuestions),
        mistakes: String(data.totalMistakes),
        time: `${Math.floor(data.timeSpent / 60)}:${(data.timeSpent % 60)
          .toString()
          .padStart(2, "0")}`,
        type: "Марафон",
      }
    : { correct: "0", mistakes: "0", time: "0:00", type: "Марафон" };

  return (
    <Container>
      {data ? (
        <div className="flex flex-col mt-4">
          <p className="text-[#3942CF]">Марафон</p>
          <div className="flex items-center justify-between w-full">
            <h1>Результаты</h1>
            <div className="flex items-center gap-2">
              <img src={clock} alt="Clock icon" />
              <p>
                {`${Math.floor(data.timeSpent / 60)}:${(data.timeSpent % 60)
                  .toString()
                  .padStart(2, "0")}`}
              </p>
            </div>
          </div>
          <br />
          <ResultCardAnswers
            right={data.questionsComplete ?? 0}
            total={data.totalQuestions ?? 0}
          >
            <div className="flex gap-2 items-center">
              {data?.questionsProgress?.answeredQuestions?.map(
                (item, index) => (
                  <div
                    key={item._id}
                    className={`px-[14px] py-[6px] rounded-full border cursor-pointer ${
                      item.isCorrect
                        ? "bg-[#5CC661] border-[#5CC661] text-white"
                        : "bg-[#DF5B5B] border-[#DF5B5B] text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                )
              )}
            </div>
          </ResultCardAnswers>
          <br />
          <ResultCard
            right={data.correctAnsweredQuestions ?? 0}
            errors={data.totalMistakes ?? 0}
          />
          <br />
          <Button
            className="py-4 border-[0.5px] border-black rounded-full"
            onClick={handleShare}
          >
            Поделиться результатом
          </Button>
          <br />
          <Button
            className="py-4 border-[0.5px] border-black rounded-full"
            onClick={() =>
              navigate(`/tickets/marathons/marathonFull/${id}/results/error`)
            }
          >
            Смотреть обзор ошибок
          </Button>
          <br />
          <Button
            className="py-4 border-[0.5px] border-black rounded-full"
            onClick={() => navigate(`/tickets`)}
          >
            Вернуться к билетам
          </Button>
          <br />
          <br />
          <br />
        </div>
      ) : (
        <>Загрузка</>
      )}
    </Container>
  );
};
