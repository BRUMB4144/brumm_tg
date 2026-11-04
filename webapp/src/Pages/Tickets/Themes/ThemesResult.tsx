import Container from "../../../components/Layouts/Container/Container";

import { ResultCardAnswers } from "../../../components/Layouts/ResultCard/ResultCardAnswers";
import { ResultCard } from "../../../components/Layouts/ResultCard/ResultCard";
import { Button } from "../../../components/ui/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ticketsService } from "../../../services/tickets.service";
import { examService } from "../../../services/exam.service";

interface IAnsweredQuestion {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  _id: string;
}

interface ICategoryProgress {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  mistakes: number;
  answeredQuestions: IAnsweredQuestion[];
  mistakesDetails: any[];
  startedAt: string | null;
  timeSpent: number;
}

interface ITicketProgress {
  ticketNumber: number;
  isCompleted: boolean;
  mistakes: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: null | string;
  timeSpent: number;
  answeredQuestions: IAnsweredQuestion[];
  _id: string;
}

interface IExamStatus {
  totalTickets: number;
  ticketsCompleted: number;
  totalMistakes: number;
  ticketsProgress: ITicketProgress[];
  nextTicket: number;
  categoriesProgress?: ICategoryProgress[];
}

export const ThemesResults = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<IExamStatus | undefined>();
  const [matchedCategory, setMatchedCategory] =
    useState<ICategoryProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const decodedId = decodeURIComponent(id || "");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await ticketsService.progressThemes();
        setData(response);

        // Find matching category
        const category = response.categoriesProgress?.find(
          (cat) => cat.category === decodedId
        );
        setMatchedCategory(category || null);
      } catch (error) {
        console.error("Error fetching themes progress:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetch
      }
    };
    fetchProgress();
  }, [decodedId]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Only create shareResult if matchedCategory exists
  const shareResult = matchedCategory
    ? {
        correct: String(matchedCategory.correctAnswers),
        mistakes: String(matchedCategory.mistakes),
        time: formatTime(matchedCategory.timeSpent),
        type: `Решение темы ${decodedId}`,
      }
    : null;

  const handleShare = async () => {
    if (!matchedCategory || !shareResult) {
      console.error("No category data available to share");
      navigate(`/tickets/themes/${id}/results/share`);
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
            console.error("Invalid image URL format:", response);
            navigate(`/tickets/themes/${id}/results/share`);
          }
        } catch (error) {
          console.error("Error sharing to story:", error);
          navigate(`/tickets/themes/${id}/results/share`);
        }
      } else {
        navigate(`/tickets/themes/${id}/results/share`);
      }
    } else {
      console.error("Telegram WebApp is not available");
      navigate(`/tickets/themes/${id}/results/share`);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <p>Загрузка...</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col mt-4">
        <p className="text-[#3942CF]">Тема {decodedId}</p>
        {data && matchedCategory ? (
          <>
            <div className="flex items-center justify-between w-full">
              <h1>Результаты</h1>
            </div>
            <br />
            <ResultCardAnswers
              right={matchedCategory.correctAnswers}
              total={matchedCategory.totalQuestions}
            >
              <div className="flex gap-2 items-center">
                {Array.isArray(matchedCategory.answeredQuestions) &&
                  matchedCategory.answeredQuestions.map((item, index) => (
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
                  ))}
              </div>
            </ResultCardAnswers>
            <br />
            <ResultCard
              right={matchedCategory.correctAnswers}
              errors={matchedCategory.mistakes}
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
              onClick={() => navigate(`/tickets/themes/${id}/results/errors`)}
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
          </>
        ) : data && !matchedCategory ? (
          <p>Категория "{decodedId}" не найдена</p>
        ) : (
          <p>Нет данных</p>
        )}
      </div>
    </Container>
  );
};
