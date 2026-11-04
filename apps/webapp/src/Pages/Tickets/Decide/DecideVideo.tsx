import { reportRequestError } from '../../../lib/requestError';
import { useState, useEffect } from "react";

import Container from "../../../components/Layouts/Container/Container";
import { ErrorCard } from "../../../components/Layouts/ErrorCard/ErrorCard";
import { ticketsService } from "../../../services/tickets.service";
import { VideoPlayer } from "../../../components/Layouts/VideoPlayer/VideoPlayer";
import { MEDIA_URL } from "../../../config";

interface IAnsweredQuestion {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  _id: string;
}

interface ITicketProgress {
  videoUrl: string[];
  ticketNumber: number;
  isCompleted: boolean;
  mistakesDetails: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: null | string;
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

export const DecideVideo = () => {
  const [data, setData] = useState<IExamStatus | undefined>();
  const lastTicketProgress = data?.ticketsProgress.slice(-1)[0] || null;
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await ticketsService.progress();
        setData(response);
      } catch (error) { reportRequestError(error); }
    };
    fetchProgress();
  }, []);
  return (
    <>
      <Container>
        <div className="flex flex-col mt-4 gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[#3942CF]">
              Билет №{lastTicketProgress?.ticketNumber}
            </p>
            <h1 className="leading-9 text-4xl">Видео разбор</h1>
          </div>
          <div className="w-full">
            <VideoPlayer
              src={`${MEDIA_URL}${lastTicketProgress?.videoUrl}`}
            />
          </div>

          {/* <iframe
            width="720"
            height="405"
            src={
              "https://rutube.ru/play/embed/5b0098145e7127dfc5912ffb5b351ac9/?p=qg-eYG420FhdjJWtmkQVAQ"
            }
            allow="clipboard-write; autoplay"
            allowFullScreen
            className="w-full h-full rounded-lg"
          /> */}
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
