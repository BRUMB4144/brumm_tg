import Container from "../../../components/Layouts/Container/Container";
import { Button } from "../../../components/ui/Button/Button";
import { Drawer } from "@geist-ui/react";
import clue from "../../../assets/16/clue.svg";
import play from "../../../assets/16/play.svg";

import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { examService } from "../../../services/exam.service";
import { VideoPlayer } from "../../../components/Layouts/VideoPlayer/VideoPlayer";
import { MEDIA_URL } from "../../../config";

// Типы для экзамена
interface Option {
  _id: string;
  text: string;
  isCorrect?: boolean;
}
interface Question {
  _id: string;
  text: string;
  imageUrl?: string;
  options: Option[];
  hint?: string;
  videoUrl?: string;
  number?: number;
}
interface ExamQuestion {
  questionId: Question;
}
interface Exam {
  _id: string;
  questions: ExamQuestion[];
}
interface ExamData {
  exam: Exam;
  questions: Question[];
}

export const MarathonNew = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ExamData>();
  const [showClue, setShowClue] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [answerError, setAnswerError] = useState<boolean>(false);
  const [active, setActive] = useState<string>("");
  const [answers, setAnswers] = useState<
    Map<string, { isCorrect: boolean; selectedIndex: number | null }>
  >(new Map());

  const errorSectionRef = useRef<HTMLDivElement>(null);
  const questionSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await examService.marathon("new");
        setData(response);
        if (response.exam.questions.length > 0) {
          setActive(response.exam.questions[0].questionId._id);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (questionSectionRef.current) {
      questionSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (answerError && errorSectionRef.current) {
      errorSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [active, answerError]);

  if (!data || !data.exam) {
    return <div className="px-[14px] mt-5">Загрузка...</div>;
  }

  const currentIndex = data.exam.questions.findIndex(
    (q) => q.questionId._id === active
  );

  const currentQuestion = data.exam.questions[currentIndex];
  const isLastQuestion = currentIndex === data.exam.questions.length - 1;

  const handleAnswer = async (selectedIndex: number) => {
    const answer = {
      questionIndex: currentIndex,
      number:
        typeof currentQuestion.questionId.number === "number"
          ? currentQuestion.questionId.number
          : 0,
      userAnswer: selectedIndex,
    };
    await examService.answerMarathon(data.exam._id, answer);

    if (!currentQuestion || !data?.questions) return;

    const currentQuestionData = data.questions.find(
      (q) => q._id === currentQuestion.questionId._id
    );
    const correctIndex = currentQuestionData?.options.findIndex(
      (option) => option.isCorrect
    );
    const isCorrect = selectedIndex === correctIndex;

    setAnswers((prev) => {
      const newAnswers = new Map(prev).set(currentQuestion.questionId._id, {
        isCorrect,
        selectedIndex,
      });
      return newAnswers;
    });

    if (isLastQuestion) {
      navigate(`/tickets/marathons/marathonFull/${data.exam._id}/results`);
      return;
    }

    if (isCorrect) {
      setAnswerError(false);
      setActive(data.exam.questions[currentIndex + 1].questionId._id);
    } else {
      setAnswerError(true);
    }
  };

  const getImageUrl = (imageUrl: string): string => {
    return imageUrl.startsWith("https://storage.watbot.ru") ? "" : imageUrl;
  };
  return (
    <Container>
      <div className="flex flex-col my-5">
        <p className="text-[#3942CF]">Марафон</p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 mt-4 overflow-x-auto py-2">
            <div className="flex gap-4">
              {data.exam.questions?.map((item, index) => {
                const answer = answers.get(item.questionId._id);
                return (
                  <div
                    key={item.questionId._id}
                    className={`px-[12px] py-[4px] rounded-full border cursor-pointer text-black ${
                      active === item.questionId._id
                        ? "bg-blue-200 border-blue-500 text-[#5C8EC6]"
                        : answer
                        ? answer.isCorrect
                          ? "bg-[#5CC661] border-[#5CC661] text-white"
                          : "bg-[#DF5B5B] border-[#DF5B5B] text-white"
                        : "bg-white border-black"
                    }`}
                    onClick={() => setActive(item.questionId._id)}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          {currentQuestion && (
            <div ref={questionSectionRef}>
              <div>
                {currentQuestion.questionId.imageUrl && (
                  <img
                    src={getImageUrl(currentQuestion.questionId.imageUrl)}
                    alt=""
                    className="mb-4 rounded-xl"
                  />
                )}
                <div className="bg-gray-100 px-3 py-4 gap-4 rounded-xl flex flex-col">
                  <p>{currentQuestion.questionId.text}</p>
                  <div className="flex items-center w-full justify-between">
                    <div className="hint" onClick={() => setShowClue(true)}>
                      <img src={clue} alt="" />
                      <p>Подсказка</p>
                    </div>
                    <div className="video" onClick={() => setShowVideo(true)}>
                      <img src={play} alt="" />
                      <p className="w-full">Видео-разбор вопроса</p>
                    </div>
                  </div>
                </div>
                {currentQuestion.questionId.options.map((option, index) => {
                  const answer = answers.get(currentQuestion.questionId._id);
                  const currentQuestionData = data.questions.find(
                    (q) => q._id === currentQuestion.questionId._id
                  );
                  const correctIndex = currentQuestionData?.options.findIndex(
                    (opt) => opt.isCorrect
                  );
                  return (
                    <Button
                      key={option._id}
                      className={`rounded-xl w-full mt-2 ${
                        answer
                          ? index === correctIndex
                            ? "bg-[#B7F2BD]"
                            : index === answer.selectedIndex
                            ? "bg-[#D48585] text-white"
                            : "bg-blue-100 active:bg-blue-300"
                          : "bg-blue-100 active:bg-blue-300"
                      }`}
                      onClick={answer ? undefined : () => handleAnswer(index)}
                    >
                      {option.text}
                    </Button>
                  );
                })}
                {answerError && (
                  <div
                    ref={errorSectionRef}
                    className="flex flex-col gap-3 mt-5 mb-10 error-section"
                  >
                    <h1 className="font-500 text-xl">Вы ответили неверно</h1>
                    <div className="flex gap-2 px-3.5 py-5 bg-gray-100 rounded-xl">
                      Правильный ответ:{" "}
                      <b>
                        {
                          data.questions
                            .find(
                              (q) => q._id === currentQuestion.questionId._id
                            )
                            ?.options.find((option) => option.isCorrect)?.text
                        }
                      </b>
                    </div>
                    <p>{currentQuestion.questionId.hint}</p>
                    <button
                      className="w-full bg-[#4B46A4] py-4 text-white rounded-xl mt-2"
                      onClick={() => {
                        if (isLastQuestion) {
                          navigate(
                            `/tickets/marathons/marathonFull/${data.exam._id}/results`
                          );
                        } else {
                          setAnswerError(false);
                          setTimeout(() => {
                            setActive(
                              data.exam.questions[currentIndex + 1].questionId
                                ._id
                            );
                          }, 200);
                        }
                      }}
                    >
                      Следующий вопрос
                    </button>
                  </div>
                )}
              </div>
              <br />
              <br />
              <br />
            </div>
          )}
        </div>
      </div>
      <Drawer
        visible={showClue}
        onClose={() => setShowClue(false)}
        placement="bottom"
        className="geist-ui-drawer"
      >
        <Drawer.Title className="geist-ui-drawer-title">Подсказка</Drawer.Title>
        <Drawer.Content>
          <p className="bg-[#5550bc] py-4 px-3 rounded-2xl text-white">
            {currentQuestion?.questionId.hint}
          </p>
        </Drawer.Content>
      </Drawer>
      <Drawer
        visible={showVideo}
        onClose={() => setShowVideo(false)}
        placement="bottom"
        className="geist-ui-drawer"
      >
        <Drawer.Title className="geist-ui-drawer-title">
          Разбор вопроса
        </Drawer.Title>
        <Drawer.Content>
          <div className="flex flex-col items-center gap-5">
            <p className="bg-[#5550bc] py-4 px-3 rounded-2xl w-full text-white">
              {currentQuestion?.questionId.text}
            </p>

            <div className="w-full h-[200px]">
              <VideoPlayer
                src={`${MEDIA_URL}${
                  data.questions.find(
                    (q) => q._id === currentQuestion?.questionId._id
                  )?.videoUrl || ""
                }`}
              />
            </div>
          </div>
        </Drawer.Content>
      </Drawer>
    </Container>
  );
};
