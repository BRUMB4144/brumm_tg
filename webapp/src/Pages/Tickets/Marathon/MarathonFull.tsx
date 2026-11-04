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
}

interface ExamQuestion {
  questionId: Question;
  userAnswer?: number;
  isCorrect?: boolean | null;
  _id: string;
}

interface Exam {
  _id: string;
  questions: ExamQuestion[];
}

interface ExamData {
  exam: Exam;
  questions: Question[];
}

export const MarathonFull = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ExamData>();
  const [showClue, setShowClue] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [answerError, setAnswerError] = useState<boolean>(false);
  const [active, setActive] = useState<string>("");

  const errorSectionRef = useRef<HTMLDivElement>(null);
  const questionSectionRef = useRef<HTMLDivElement>(null);
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await examService.marathon("all");
        setData(response);
        if (response.exam.questions.length > 0) {
          const unansweredQuestion = response.exam.questions.find(
            (q: ExamQuestion) => q.isCorrect === null
          );
          if (unansweredQuestion) {
            setActive(unansweredQuestion.questionId._id);
          } else {
            // Если все отвечены, оставить первый
            setActive(response.exam.questions[0].questionId._id);
          }
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

  // Автоматическая прокрутка к активному вопросу
  useEffect(() => {
    if (questionsContainerRef.current && active) {
      const activeQuestionElement = questionsContainerRef.current.querySelector(
        `[data-question-id="${active}"]`
      );
      if (activeQuestionElement) {
        activeQuestionElement.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [active]);

  if (!data || !data.exam) {
    return <div className="px-[14px] mt-5">Загрузка...</div>;
  }

  const currentIndex = data.exam.questions.findIndex(
    (q) => q.questionId._id === active
  );
  const currentQuestion = data.exam.questions[currentIndex];
  const isLastQuestion = currentIndex === data.exam.questions.length - 1;

  const handleAnswer = async (selectedIndex: number) => {
    if (currentQuestion.isCorrect !== null) {
      return;
    }

    const questionIndex = currentIndex;
    const answer = {
      questionIndex,
      userAnswer: selectedIndex,
    };

    try {
      await examService.answerMarathon(data.exam._id, answer);

      // Находим вопрос в массиве questions по _id
      const questionFromQuestions = data.questions.find(
        (q) => q._id === currentQuestion.questionId._id
      );

      // Проверяем правильность по выбранному индексу
      const isCorrect =
        questionFromQuestions?.options[selectedIndex]?.isCorrect === true;

      setData((prevData) => {
        if (!prevData) return prevData;
        const updatedQuestions = [...prevData.exam.questions];
        updatedQuestions[currentIndex] = {
          ...updatedQuestions[currentIndex],
          userAnswer: selectedIndex,
          isCorrect: isCorrect,
        };
        return {
          ...prevData,
          exam: {
            ...prevData.exam,
            questions: updatedQuestions,
          },
        };
      });

      if (isCorrect) {
        setAnswerError(false);
        if (!isLastQuestion) {
          setActive(data.exam.questions[currentIndex + 1].questionId._id);
        }
      } else {
        setAnswerError(true);
      }
    } catch (error) {
      console.error("Ошибка при отправке ответа:", error);
    }
  };

  const getImageUrl = (imageUrl: string): string => {
    return imageUrl.startsWith("https://storage.watbot.ru") ? "" : imageUrl;
  };
  return (
    <Container>
      <div className="flex flex-col my-5">
        <p className="text-[#3942CF]">Марафон вопросов</p>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 mt-4 overflow-x-auto py-2">
            <div className="flex gap-4" ref={questionsContainerRef}>
              {data.exam.questions?.map((item, index) => {
                return (
                  <div
                    key={item.questionId._id}
                    data-question-id={item.questionId._id}
                    className={`px-[12px] py-[4px] rounded-full border cursor-pointer text-black ${
                      active === item.questionId._id
                        ? "bg-blue-200 border-blue-500 text-[#5C8EC6]"
                        : item.isCorrect === true
                        ? "bg-[#5CC661] border-[#5CC661] text-white"
                        : item.isCorrect === false
                        ? "bg-[#DF5B5B] border-[#DF5B5B] text-white"
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
          {currentQuestion ? (
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
                  const currentQuestionData = data.questions.find(
                    (q) => q._id === currentQuestion.questionId._id
                  );
                  const correctIndex = currentQuestionData?.options.findIndex(
                    (opt) => opt.isCorrect === true
                  );
                  const isAnswered = currentQuestion.isCorrect !== null;
                  const isCorrectAnswer = index === correctIndex;
                  const isSelectedAnswer = currentQuestion.userAnswer === index;

                  return (
                    <Button
                      key={option._id}
                      className={`rounded-3xl py-5 w-full mt-2 text-start ${
                        isAnswered
                          ? isCorrectAnswer
                            ? "bg-[#B7F2BD]"
                            : isSelectedAnswer && !isCorrectAnswer
                            ? "bg-[#D48585] text-white"
                            : "bg-blue-100 active:bg-blue-300"
                          : "bg-blue-100 active:bg-[#85A8D4] active:text-white"
                      }`}
                      onClick={
                        isAnswered ? undefined : () => handleAnswer(index)
                      }
                    >
                      {option.text}
                    </Button>
                  );
                })}
                {answerError && currentQuestion.isCorrect === false && (
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
                            ?.options.find(
                              (option) => option.isCorrect === true
                            )?.text
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
                <br />
                <br />
                <br />
              </div>
            </div>
          ) : (
            <div>Вопрос не найден</div>
          )}
        </div>
        <br />
        <br />
        <br />
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
            {/* <Link
              to={
                data.questions.find(
                  (q) => q._id === currentQuestion?.questionId._id
                )?.videoUrl || ""
              }
              className="w-full"
            >
              <div className="h-[200px] w-full bg-black rounded-xl flex items-center justify-center">
                <img src={Play} className="w-[50px]" alt="" />
              </div>
            </Link> */}
          </div>
        </Drawer.Content>
      </Drawer>
    </Container>
  );
};
