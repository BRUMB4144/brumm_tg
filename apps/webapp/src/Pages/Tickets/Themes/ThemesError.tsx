import { useState, useEffect } from "react";
import Container from "../../../components/Layouts/Container/Container";
import { ErrorCard } from "../../../components/Layouts/ErrorCard/ErrorCard";

import { useParams } from "react-router-dom";
import { ticketsService } from "../../../services/tickets.service";
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
  categoriesProgress?: {
    category: string;
    totalQuestions: number;
    correctAnswers: number;
    mistakes: number;
    answeredQuestions: IAnsweredQuestion[];
    mistakesDetails: any[];
    startedAt: string | null;
  }[];
}

export const ThemesError = () => {
  const [data, setData] = useState<IExamStatus | undefined>();
  const { id } = useParams<{ id: string }>();

  const [matchedCategory, setMatchedCategory] = useState<any | null>(null);

  const decodedId = decodeURIComponent(id || "");

  useEffect(() => {
    const fetchProgress = async () => {
      const response = await ticketsService.progressThemes();
      setData(response);

      const category = response.categoriesProgress?.find(
        (cat) => cat.category === decodedId
      );
      setMatchedCategory(category || null);
    };
    fetchProgress();
  }, [decodedId]);
  const getImageUrl = (imageUrl: string): string => {
    return imageUrl.startsWith("https://storage.watbot.ru") ? "" : imageUrl;
  };
  return (
    <>
      <Container>
        <div className="flex flex-col mt-4 gap-4 ">
          <div className="flex flex-col gap-1">
            <p className="text-[#3942CF]">Тема {decodedId}</p>
            <h1 className="leading-9 text-4xl">
              Допущенные <br /> ошибки
            </h1>
          </div>
          {matchedCategory?.mistakesDetails.map((item) => {
            return (
              <ErrorCard
                key={item._id}
                img={getImageUrl(item.imageUrl)}
                title={item.questionText}
                error={item.selectedOption}
                right={item.correctOption}
                analysis={item?.hint || ""}
              />
            );
          })}
        </div>
      </Container>
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};
