import Container from "../../../components/Layouts/Container/Container";
import clock from "../../../assets/Tickets/Results/Clock.svg";
import { ResultCardAnswers } from "../../../components/Layouts/ResultCard/ResultCardAnswers";
import { ResultCard } from "../../../components/Layouts/ResultCard/ResultCard";
import { Button } from "../../../components/ui/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { examService } from "../../../services/exam.service";

interface IOption {
  text: string;
  isCorrect: boolean;
}

interface IQuestionDetails {
  _id: string;
  text: string;
  imageUrl: string;
  options: IOption[];
  hint: string;
  videoUrl: string;
  category: string;
  questionNumber?: number;
}

interface IQuestion {
  questionId: IQuestionDetails;
  userAnswer: number | null;
  isCorrect: boolean | null;
}

interface IExtraQuestion {
  questionId: IQuestionDetails;
  userAnswer: number | null;
  isCorrect: boolean | null;
}

interface IMistakeDetails {
  questionId: string;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  _id?: string;
}

interface IExam {
  _id: string;
  userId: string;
  ticketNumber: number;
  questions: IQuestion[];
  extraQuestions: IExtraQuestion[];
  mistakes: number;
  status: "in_progress" | "completed" | "failed";
  startTime: string;
  timeLimit: number;
  extraTime: number;
  mistakesDetails: IMistakeDetails[];
  completedAt?: string | null;
  __v?: number;
}

interface IStatistics {
  totalQuestions: number;
  correctAnswers: number;
  mistakes: number;
  timeSpent: number;
  status: "in_progress" | "completed" | "failed";
  completedAt: string | null;
}

interface IExamStatus {
  exam: IExam;
  statistics: IStatistics;
}

export const ExamResults = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<IExamStatus | null>(null);
  const [image, setImage] = useState<string | null | { imageUrl: string }>({
    imageUrl: "",
  });
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await examService.result(id);
        setData(response);
      } catch (error) {
        console.error("Не удалось загрузить результаты экзамена:", error);
      }
    };
    fetchProgress();
  }, [id]);

  if (!data) {
    return <div>Загрузка...</div>;
  }

  const minutes = Math.floor(data.statistics.timeSpent / 60);
  const seconds = data.statistics.timeSpent % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const shareResult = {
    correct: String(data.statistics.correctAnswers),
    mistakes: String(data.exam.mistakes),
    time: formattedTime,
    type: "Экзамен",
  };
  const handleShare = async () => {
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
            navigate(`/tickets/exam/${id}/results/share`);
          }
        } catch (error) {
          console.error("Ошибка при попытке поделиться в истории:", error);
          navigate(`/tickets/exam/${id}/results/share`);
        }
      } else {
        navigate(`/tickets/exam/${id}/results/share`);
      }
    } else {
      console.error("Telegram WebApp недоступен");
      navigate(`/tickets/exam/${id}/results/share`);
    }
  };
  const allQuestions = [...data.exam.questions, ...data.exam.extraQuestions];

  return (
    <Container>
      <div className="flex flex-col mt-4">
        <div className="flex items-center justify-between w-full">
          <h1>Экзамен</h1>
          <div className="flex items-center gap-2">
            <img src={clock} alt="Clock icon" />
            <p>{formattedTime}</p>
          </div>
        </div>
        <br />
        <ResultCardAnswers
          right={data.statistics.correctAnswers}
          total={data.statistics.totalQuestions}
        >
          <div className="flex gap-2 items-center">
            {allQuestions.map((item, index) => (
              <div
                key={index}
                className={`px-[14px] py-[6px] rounded-full border cursor-pointer ${
                  item.isCorrect === true
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
          right={data.statistics.correctAnswers}
          errors={data.exam.mistakes}
        />
        <br />
        <Button
          className="py-4 border-[0.5px] border-black rounded-full"
          onClick={handleShare}
          // onClick={() => navigate(`/tickets/exam/${id}/results/share`)}
        >
          Поделиться результатом
        </Button>
        <br />
        <Button
          className="py-4 border-[0.5px] border-black rounded-full"
          onClick={() => navigate(`/tickets/exams/${id}/results/error`)}
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
        <br />
        <br />
        <br />
      </div>
    </Container>
  );
};
