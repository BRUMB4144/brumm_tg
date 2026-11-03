import { useState, useEffect } from "react";

import Container from "../../../components/Layouts/Container/Container";
import { ErrorCard } from "../../../components/Layouts/ErrorCard/ErrorCard";
import { ticketsService } from "../../../services/tickets.service";

// Интерфейс для вопроса с ошибкой
interface IMistakeDetail {
  questionId: string;
  questionText: string;
  selectedOption: string;
  correctOption: string;
  hint: string;
  imageUrl: string;
  _id: string;
}

// Интерфейс для отвеченного вопроса
interface IAnsweredQuestion {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  hint: string;
  imageUrl: string;
  _id: string;
}

// Интерфейс для прогресса билета
interface ITicketProgress {
  ticketNumber: number;
  isCompleted: boolean;
  mistakes: number; // Количество ошибок (число)
  mistakesDetails: IMistakeDetail[]; // Массив объектов с деталями ошибок
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string | null;
  answeredQuestions: IAnsweredQuestion[];
  _id: string;
}

// Интерфейс для статуса экзамена
interface IExamStatus {
  totalTickets: number;
  ticketsCompleted: number;
  totalMistakes: number;
  ticketsProgress: ITicketProgress[];
  nextTicket: number;
}

export const DecideError = () => {
  const [data, setData] = useState<IExamStatus | undefined>();
  const lastTicketProgress = data?.ticketsProgress.slice(-1)[0] || null;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await ticketsService.progress();
        setData(response);
      } catch (error) {
        console.error("Ошибка при загрузке прогресса:", error);
      }
    };
    fetchProgress();
  }, []);

  const getImageUrl = (imageUrl: string): string => {
    return imageUrl.startsWith("https://storage.watbot.ru") ? "" : imageUrl;
  };

  return (
    <Container>
      <div className="flex flex-col mt-4 gap-4">
        {lastTicketProgress ? (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-[#3942CF]">
                Билет №{lastTicketProgress.ticketNumber}
              </p>
              <h1 className="leading-9 text-4xl">
                Допущенные <br /> ошибки
              </h1>
            </div>
            {lastTicketProgress.mistakesDetails.length > 0 ? (
              lastTicketProgress.mistakesDetails.map((item) => (
                <ErrorCard
                  key={item._id}
                  img={getImageUrl(item.imageUrl)}
                  title={item.questionText}
                  error={item.selectedOption}
                  right={item.correctOption}
                  analysis={item.hint}
                />
              ))
            ) : (
              <p>Ошибок в этом билете нет.</p>
            )}
          </>
        ) : (
          <p>Данные о прогрессе отсутствуют.</p>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};
