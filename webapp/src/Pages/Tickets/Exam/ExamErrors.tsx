import { reportRequestError } from '../../../lib/requestError';
import { useState, useEffect } from "react";
import Container from "../../../components/Layouts/Container/Container";
import { ErrorCard } from "../../../components/Layouts/ErrorCard/ErrorCard";
import { examService } from "../../../services/exam.service";
import { useParams } from "react-router-dom";

// Интерфейсы (исправим несоответствие с данными)
interface IOption {
  text: string;
  isCorrect: boolean;
}

interface IQuestion {
  questionId: string;
  text: string;
  imageUrl: string;
  options: IOption[];
  hint: string;
  videoUrl: string;
  category: string;
  questionNumber?: number;
  userAnswer: number | null;
  isCorrect: boolean | null;
}

interface IExtraQuestion {
  questionId: string;
  text: string;
  imageUrl: string;
  options: IOption[];
  hint: string;
  videoUrl: string;
  category: string;
  questionNumber?: number;
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

export const ExamErrors = () => {
  const [data, setData] = useState<IExamStatus | undefined>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await examService.result(id);
        setData(response);
      } catch (error) { reportRequestError(error); }
    };
    fetchProgress();
  }, [id]);

  // Создаем карту для быстрого поиска imgUrl и hint по questionId
  const questionsMap = new Map<string, { imgUrl: string; hint: string }>();
  data?.exam.questions.forEach((question) => {
    questionsMap.set(question.questionId, {
      imgUrl: question.imageUrl,
      hint: question.hint,
    });
  });

  data?.exam.extraQuestions.forEach((extraQuestion) => {
    questionsMap.set(extraQuestion.questionId, {
      imgUrl: extraQuestion.imageUrl,
      hint: extraQuestion.hint,
    });
  });

  const getImageUrl = (imageUrl: string): string => {
    return imageUrl.startsWith("https://storage.watbot.ru") ? "" : imageUrl;
  };

  return (
    <>
      <Container>
        <div className="flex flex-col mt-4 gap-4 ">
          <div className="flex flex-col gap-1">
            <p className="text-[#3942CF]">Экзамен</p>
            <h1 className="leading-9 text-4xl">
              Допущенные <br /> ошибки
            </h1>
          </div>
          {data?.exam.mistakesDetails.map((item) => {
            const questionData = questionsMap.get(item.questionId);
            return (
              <ErrorCard
                key={item._id}
                img={getImageUrl(questionData?.imgUrl || "")}
                title={item.questionText}
                error={item.selectedOption}
                right={item.correctOption}
                analysis={questionData?.hint || ""}
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
