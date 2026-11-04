import { useState, useEffect } from "react";

import clock from "../../../assets/Tickets/Results/Clock.svg";
// import arrows from "../../../assets/arrows.svg";
import Container from "../../../components/Layouts/Container/Container";
import { Border } from "../../../components/ui/Border/Border";
import { examService } from "../../../services/exam.service";
import { useNavigate, useParams } from "react-router-dom";
import modalClose from "../../../assets/modalClose.svg";
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

export const ExamShare = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<IExamStatus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await examService.result(id);
        setData(response);
      } catch (error) {
        console.error("Failed to fetch exam results:", error);
      }
    };
    fetchProgress();
  }, [id]);

  const minutes = Math.floor(data?.statistics.timeSpent / 60);
  const seconds = data?.statistics.timeSpent % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

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
              <p className="text-[#3942CF] text-xl">Экзамен</p>
              <br />
              <div className="flex items-center justify-between w-full px-5">
                <p className="text-xl font-medium">Правильных ответов:</p>
                <p className="flex items-center text-gray-500 text-xl gap-1 font-medium">
                  <span className="text-[#47B355]">
                    {data?.statistics.correctAnswers}
                  </span>
                  <span>/</span>
                  {data?.statistics.totalQuestions}
                </p>
              </div>
              <div className="px-5">
                <Border />
              </div>
              <div className="flex items-center justify-between w-full px-5">
                <p className="text-lg">Ошибок</p>
                <p className="flex items-center text-gray-500 text-lg">
                  <span className="text-[#47B355]">
                    {data?.statistics.mistakes}/
                  </span>
                  {data?.statistics.totalQuestions}
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
                      <p>{formattedTime}</p>
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
