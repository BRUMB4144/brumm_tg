import { reportRequestError } from '../../../lib/requestError';
import { useState, useEffect } from "react";

import { ticketsService } from "../../../services/tickets.service";
import clock from "../../../assets/Tickets/Results/Clock.svg";
// import arrows from "../../../assets/arrows.svg";
import Container from "../../../components/Layouts/Container/Container";
import { Border } from "../../../components/ui/Border/Border";
import modalClose from "../../../assets/modalClose.svg";
import { useNavigate } from "react-router-dom";
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

export const DecideShare = () => {
  const [data, setData] = useState<IExamStatus | undefined>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await ticketsService.progress();
        setData(response);
      } catch (error) { reportRequestError(error); }
    };
    fetchProgress();
  }, []);
  const lastTicketProgress = data?.ticketsProgress.slice(-1)[0] || null;
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  return (
    <div
      className="h-[100vh] bg-cover overflow-hidden"
      style={{
        backgroundImage: `
      linear-gradient(180deg, #3A7CFF, #6F31FF),
      linear-gradient(180deg, #1D107F, rgba(0, 0, 0, 0))
    `,
      }}
    >
      <div className="mt-20">
        <Container>
          <div className="w-full flex justify-between mt-30">
            <img
              src={modalClose}
              alt=""
              className=""
              onClick={() => navigate("/tickets")}
            />

            <div></div>
          </div>
          <div className="flex flex-col items-center text-center text-white gap-10">
            <h1 className="text-4xl mt-[60px] font-medium">Мои результаты</h1>
            <div className="bg-white w-full text-[#1E1E1E] pt-11 rounded-3xl">
              <p className="text-[#3942CF] text-xl">Решение билетов ПДД</p>
              <br />
              <div className="flex items-center justify-between w-full px-5">
                <p className="text-xl font-medium">Правильных ответов:</p>
                <p className="flex items-center text-gray-500 text-xl gap-1 font-medium">
                  <span className="text-[#47B355]">
                    {lastTicketProgress?.correctAnswers}
                  </span>
                  <span>/</span>
                  {lastTicketProgress?.totalQuestions}
                </p>
              </div>
              <div className="px-5">
                <Border />
              </div>
              <div className="flex items-center justify-between w-full px-5">
                <p className="text-lg">Ошибок</p>
                <p className="flex items-center text-gray-500 text-lg">
                  <span className="text-[#47B355]">
                    {lastTicketProgress?.mistakes}/
                  </span>
                  {lastTicketProgress?.totalQuestions}
                </p>
              </div>
              <div className="px-2">
                <div className="relative mt-10 mb-5 ">
                  <div className="w-full bg-[#525CFC] opacity-10 top-0 absolute rounded-2xl px-5 py-6 ">
                    _
                  </div>
                  <div className="flex justify-between w-full px-5 py-6 text-lg">
                    <p>Мое время:</p>
                    <div className="flex gap-1 items-center">
                      <img src={clock} width={24} alt="" />
                      <p>{formatTime(lastTicketProgress?.timeSpent)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <h1 className="text-3xl font-light ">
              Проверь насколько ты знаешь теорию ПДД в приложении Guseff Go
            </h1>
            <h1 className="text-3xl font-light ">Переходи</h1>
            <img src={arrows} alt="" /> */}
          </div>
        </Container>
      </div>
    </div>
  );
};
