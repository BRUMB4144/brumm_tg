import { useParams, useNavigate } from "react-router-dom";
import Container from "../../../components/Layouts/Container/Container";
import { useEffect, useState, useRef } from "react";
import smile from "../../../assets/Tickets/Exam/smile.svg";
import smileRed from "../../../assets/Tickets/Exam/smileRed.svg";
import { Button } from "../../../components/ui/Button/Button";
import { examService } from "../../../services/exam.service";
import { IExamStatus } from "../../../types/exam.types";

export const Exam = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeQ, setActiveQ] = useState<number>(1);
  const [data, setData] = useState<IExamStatus | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [remainingTime, setRemainingTime] = useState(20 * 60 * 1000); // 20 минут в миллисекундах
  const [timerStarted, setTimerStarted] = useState(false);
  const prevMistakesRef = useRef(0);
  const getImageUrl = (imageUrl: string): string => {
    return imageUrl.startsWith("https://storage.watbot.ru") ? "" : imageUrl;
  };

  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const getSmileIcon = (index: number) =>
    data && data.exam.mistakes > index ? smileRed : smile;

  const getPenalty = (mistakes: number): string => {
    switch (mistakes) {
      case 1:
        return "5";
      case 2:
        return "10";
      case 3:
        return "15";
      default:
        return "0";
    }
  };

  // Форматирование времени в формат MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleAnswer = async (questionId: string, userAnswer: number) => {
    if (!id || !data?.exam?.questions) return;
    try {
      await examService.sendAnswer(id, {
        questionIndex: activeQ - 1,
        userAnswer,
      });

      const status = await examService.status(id);
      setData(status);

      const totalQuestions =
        status.exam.questions.length + status.exam.extraQuestions.length;

      if (status.exam.mistakes >= 3) {
        navigate(`/tickets/exams/${id}/results`);
      } else if (activeQ >= totalQuestions) {
        navigate(`/tickets/exams/${id}/results`);
      } else {
        setActiveQ((prev) => Math.min(prev + 1, totalQuestions));
      }
    } catch (err) {
      console.error("Ошибка при отправке ответа:", err);
      setError("Не удалось отправить ответ");
    }
  };

  // Загрузка данных экзамена
  useEffect(() => {
    const fetchStatus = async () => {
      if (!id) {
        setError("ID экзамена отсутствует");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const status = await examService.status(id);
        if (!status?.exam?.questions?.length) {
          throw new Error("Вопросы экзамена не найдены");
        }
        setData(status);
      } catch (err) {
        console.error("Ошибка при получении статуса экзамена:", err);
        setError("Не удалось загрузить данные экзамена");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [id]);

  // Корректировка activeQ при изменении данных
  useEffect(() => {
    if (data?.exam) {
      const totalQuestions =
        data.exam.questions.length + data.exam.extraQuestions.length;
      if (activeQ > totalQuestions) {
        setActiveQ(1);
      }
    }
  }, [data, activeQ]);

  // Старт таймера при первой загрузке данных
  useEffect(() => {
    if (data && !timerStarted) {
      setRemainingTime(20 * 60 * 1000); // Устанавливаем 20 минут
      prevMistakesRef.current = data.exam.mistakes;
      setTimerStarted(true);
    }
  }, [data, timerStarted]);

  // Обновление таймера каждую секунду
  useEffect(() => {
    if (timerStarted) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => Math.max(0, prev - 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerStarted]);

  // Переход на страницу результатов, когда время истекло
  useEffect(() => {
    if (remainingTime === 0 && timerStarted) {
      navigate(`/tickets/exams/${id}/results`);
    }
  }, [remainingTime, timerStarted, id, navigate]);

  // Добавление 5 минут при увеличении количества ошибок
  useEffect(() => {
    if (data && timerStarted) {
      if (data.exam.mistakes > prevMistakesRef.current) {
        const mistakesIncrease = data.exam.mistakes - prevMistakesRef.current;
        setRemainingTime((prev) => prev + mistakesIncrease * 5 * 60 * 1000);
      }
      prevMistakesRef.current = data.exam.mistakes;
    }
  }, [data, timerStarted]);

  // Прокрутка к активному вопросу
  useEffect(() => {
    if (questionRefs.current[activeQ - 1]) {
      questionRefs.current[activeQ - 1].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeQ]);

  if (isLoading || error || !data || !data.exam || !data.exam.questions) {
    return (
      <Container>
        <div className="mt-5">{error || "Загрузка..."}</div>
      </Container>
    );
  }

  const allQuestions = [...data.exam.questions, ...data.exam.extraQuestions];
  const currentQuestion = allQuestions[activeQ - 1];

  if (!currentQuestion) {
    return (
      <Container>
        <div className="mt-5">Вопрос не найден</div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col mt-5 mb-2.5">
        <h1 className="text-[#3942CF] text-md">Экзамен</h1>
        <div className="flex items-center justify-between">
          <p className="text-xl">Билет №{currentQuestion.sourceTicketNumber ?? data.exam.ticketNumber}</p>
          <p className="text-xl">{formatTime(remainingTime)}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2">
            {[0, 1, 2].map((index) => (
              <img
                key={index}
                src={getSmileIcon(index)}
                alt="Индикатор ошибок"
              />
            ))}
            <p className="text-[#DA4444]">
              {data.exam.mistakes > 0
                ? `${data.exam.mistakes} ${
                    data.exam.mistakes > 1 ? "ошибки" : "ошибка"
                  }`
                : ""}
            </p>
          </div>
          <div className="flex gap-1 text-sm text-gray-300">
            <p className="flex items-center">
              +{getPenalty(data.exam.mistakes)} вопросов
            </p>
            <p className="flex items-center">
              +{getPenalty(data.exam.mistakes)} минут
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto py-2">
          {allQuestions.map((_, index) => (
            <div
              key={index}
              ref={(el) => {
                questionRefs.current[index] = el;
              }}
              className={`px-3 text-center py-1 rounded-full bg-[#5C8EC6] text-white cursor-pointer ${
                activeQ === index + 1 ? "opacity-100" : "opacity-30"
              }`}
              onClick={() => setActiveQ(index + 1)}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {currentQuestion.imageUrl && (
            <img
              src={getImageUrl(currentQuestion.imageUrl)}
              alt=""
              className="rounded-xl"
            />
          )}
          <p className="bg-gray-200 px-3 py-4 rounded-xl">
            {currentQuestion.text}
          </p>
          {currentQuestion.options.map((answer, index) => (
            <Button
              key={answer._id}
              className="bg-blue-100 rounded-3xl py-5 active:bg-[#85A8D4] active:text-white text-start"
              onClick={() => handleAnswer(currentQuestion.questionId, index)}
            >
              {answer.text}
            </Button>
          ))}
        </div>
      </div>
      <br />
      <br />
      <br />
    </Container>
  );
};
