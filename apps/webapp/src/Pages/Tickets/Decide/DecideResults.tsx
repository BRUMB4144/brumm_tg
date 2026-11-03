import Container from "../../../components/Layouts/Container/Container";
import clock from "../../../assets/Tickets/Results/Clock.svg";
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
}

export const DecideResults = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<IExamStatus | undefined>();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await ticketsService.progress();
        setData(response);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetch completes
      }
    };
    fetchProgress();
  }, []);

  const lastTicketProgress = data?.ticketsProgress?.slice(-1)[0] || null;

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Only create shareResult if lastTicketProgress exists
  const shareResult = lastTicketProgress
    ? {
        correct: String(lastTicketProgress.correctAnswers),
        mistakes: String(lastTicketProgress.mistakes),
        time: formatTime(lastTicketProgress.timeSpent),
        type: "Решение билетов ПДД",
      }
    : null;

  const handleShare = async () => {
    if (!lastTicketProgress || !shareResult) {
      console.error("No ticket progress available to share");
      navigate(`/tickets/decide/share`);
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
            navigate(`/tickets/decide/share`);
          }
        } catch (error) {
          console.error("Error sharing to story:", error);
          navigate(`/tickets/decide/share`);
        }
      } else {
        navigate(`/tickets/decide/share`);
      }
    } else {
      console.error("Telegram WebApp is not available");
      navigate(`/tickets/decide/share`);
    }
  };

  if (isLoading) {
    return <Container>Загрузка...</Container>;
  }

  if (!lastTicketProgress) {
    return <Container>Нет данных о последнем билете</Container>;
  }

  return (
    <Container>
      <div className="flex flex-col mt-4">
        <p className="text-[#3942CF]">
          Билет №{lastTicketProgress.ticketNumber}
        </p>
        <div className="flex items-center justify-between w-full">
          <h1>Результаты</h1>
          <div className="flex items-center gap-2">
            <img src={clock} alt="Clock" />
            <p>{formatTime(lastTicketProgress.timeSpent)}</p>
          </div>
        </div>
        <br />
        <ResultCardAnswers
          right={lastTicketProgress.correctAnswers}
          total={lastTicketProgress.totalQuestions}
        >
          <div className="flex gap-2 items-center">
            {Array.isArray(lastTicketProgress?.answeredQuestions) &&
              lastTicketProgress.answeredQuestions.map((item, index) => (
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
          right={lastTicketProgress.correctAnswers}
          errors={lastTicketProgress.mistakes}
        />
        <br />
        <div className="flex flex-col gap-2">
          <Button
            className="py-4 border-[0.5px] border-black rounded-full"
            onClick={handleShare}
          >
            Поделиться результатом
          </Button>
          <Button
            className="py-4 border-[0.5px] border-black rounded-full"
            onClick={() => navigate("/tickets/decide/errors")}
          >
            Смотреть обзор ошибок
          </Button>

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
      </div>
    </Container>
  );
};
