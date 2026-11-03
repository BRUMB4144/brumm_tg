import Container from "../../../components/Layouts/Container/Container";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Button } from "../../../components/ui/Button/Button";
import { ticketsService } from "../../../services/tickets.service";
import { ITicket } from "../../../types/tickets.types";
import { Drawer } from "@geist-ui/react";
import clue from "../../../assets/16/clue.svg";
import play from "../../../assets/16/play.svg";
import { useNavigate, useParams } from "react-router-dom";
import { VideoPlayer } from "../../../components/Layouts/VideoPlayer/VideoPlayer";
import { MEDIA_URL } from "../../../config";

interface Option {
  text: string;
  isCorrect: boolean;
  _id?: string;
}

export const DecideId = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ITicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<number>(1);
  const [answers, setAnswers] = useState<Map<number, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [answerError, setAnswerError] = useState<boolean>(false);
  const [showClue, setShowClue] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const errorSectionRef = useRef<HTMLDivElement>(null);
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<
    { questionId: string; selectedOption: string }[]
  >([]);

  const handleClick = () => {
    setShowClue(false);
    setShowVideo(false);
  };
  const handleOpenVideo = async () => {
    const getQuestionReview = await ticketsService.getQuestionReview();
    if (getQuestionReview.status === false) {
      navigate("/landing");
    } else {
      setShowVideo(true);
    }
  };
  useEffect(() => {
    if (questionsContainerRef.current) {
      const activeQuestionElement = questionsContainerRef.current.querySelector(
        `[data-question-number="${activeQuestion}"]`
      );
      if (activeQuestionElement) {
        activeQuestionElement.scrollIntoView({
          behavior: "smooth",
          inline: "center",
        });
      }
    }
  }, [activeQuestion]);

  useEffect(() => {
    if (answerError && errorSectionRef.current) {
      errorSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [answerError]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ticketsService.getTicket(Number(id));

        if (Array.isArray(response)) {
          const ticket = response.find((item) => item.number === Number(id));
          if (ticket && isValidTicket(ticket)) {
            setData([ticket]);
            setSelectedTicket(ticket);
          } else {
            setError("Билет не найден в ответе");
            setData([]);
          }
        } else if (isValidTicket(response)) {
          setData([response]);
          setSelectedTicket(response);
        } else {
          setError("Получены некорректные данные билета");
          setData([]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке билета:", error);
        setError("Не удалось загрузить билет");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useLayoutEffect(() => {
    setSelectedOption(null);
    setAnswerError(false);
  }, [activeQuestion]);

  const isValidTicket = (data: any): data is ITicket => {
    return (
      data &&
      typeof data === "object" &&
      "_id" in data &&
      typeof data._id === "string" &&
      "number" in data &&
      typeof data.number === "number" &&
      "questions" in data &&
      Array.isArray(data.questions) &&
      data.questions.every(
        (q: any) =>
          typeof q === "object" &&
          "_id" in q &&
          "text" in q &&
          "imageUrl" in q &&
          "options" in q &&
          Array.isArray(q.options) &&
          q.options.every(
            (opt: any) =>
              typeof opt === "object" &&
              "text" in opt &&
              typeof opt.text === "string" &&
              "isCorrect" in opt &&
              typeof opt.isCorrect === "boolean"
          ) &&
          "questionNumber" in q &&
          typeof q.questionNumber === "number"
      )
    );
  };

  const handleAnswer = async (option: Option): Promise<void> => {
    if (
      !option ||
      typeof option.text !== "string" ||
      typeof option.isCorrect !== "boolean"
    ) {
      setError("Некорректный формат ответа");
      return;
    }

    const isCorrect = option.isCorrect;
    setAnswers((prev) => new Map(prev).set(activeQuestion, isCorrect));
    setSelectedOption(option);

    const currentQuestion = selectedTicket?.questions.find(
      (q) => q.questionNumber === activeQuestion
    );

    if (currentQuestion) {
      const newAnswer = {
        questionId: currentQuestion._id,
        selectedOption: option.text,
      };

      setSubmittedAnswers((prev) => [...prev, newAnswer]);

      try {
        await ticketsService.answer(Number(id), {
          answers: [newAnswer],
        });
      } catch (error) {
        console.error("Ошибка при отправке ответа:", error);
        setActiveQuestion((prev) => prev + 1);
        return;
      }
    }

    if (isCorrect) {
      setAnswerError(false);
      const maxQuestionNumber =
        data[0]?.questions?.length > 0
          ? Math.max(...data[0].questions.map((q) => q.questionNumber))
          : activeQuestion;

      if (activeQuestion === 20) {
        navigate(`/tickets/decide/${id}/results`);
      } else if (activeQuestion < maxQuestionNumber) {
        setActiveQuestion((prev) => prev + 1);
      }
    } else {
      setAnswerError(true);
    }
  };

  const handleNextQuestion = () => {
    const maxQuestionNumber =
      data[0]?.questions?.length > 0
        ? Math.max(...data[0].questions.map((q) => q.questionNumber))
        : activeQuestion;
    if (activeQuestion < maxQuestionNumber) {
      setAnswerError(false);
      setTimeout(() => {
        setActiveQuestion((prev) => prev + 1);
      }, 150);
    }
  };

  const sortedQuestions =
    data[0]?.questions?.sort((a, b) => a.questionNumber - b.questionNumber) ||
    [];
  const getImageUrl = (imageUrl: string): string => {
    return imageUrl.startsWith("https://storage.watbot.ru") ? "" : imageUrl;
  };

  // const getRutubeEmbedUrl = (videoUrl: string): string => {
  //   try {
  //     const url = new URL(videoUrl);
  //     const pathParts = url.pathname.split("/").filter((part) => part);
  //     const videoId = pathParts[pathParts.length - 1];
  //     const query = url.search;

  //     return `https://rutube.ru/play/embed/${videoId}${query}&no_redirect=1&autoplay=1`;
  //   } catch (error) {
  //     console.error("Invalid video URL:", error);
  //     return videoUrl;
  //   }
  // };
  return (
    <>
      <Container>
        <div className="flex flex-col my-5">
          <p className="text-[#3942CF]">Тренировка билета №{id}</p>

          {isLoading ? (
            <p className="mt-4">Загрузка...</p>
          ) : error ? (
            <p className="mt-4 text-red-500">{error}</p>
          ) : (
            <>
              <div
                ref={questionsContainerRef}
                className="flex gap-2 mt-4 overflow-x-auto py-2"
              >
                {Array.isArray(data) &&
                data.length > 0 &&
                Array.isArray(sortedQuestions) &&
                sortedQuestions.length > 0 ? (
                  sortedQuestions.map((question) => (
                    <div
                      key={question._id}
                      data-question-number={question.questionNumber}
                      onClick={() => setActiveQuestion(question.questionNumber)}
                      className={`px-[14px] py-[6px] rounded-full border cursor-pointer text-black ${
                        activeQuestion === question.questionNumber
                          ? "bg-blue-200 border-blue-500 text-[#5C8EC6]"
                          : answers.has(question.questionNumber)
                          ? answers.get(question.questionNumber)
                            ? "bg-[#5CC661] border-[#5CC661] text-white"
                            : "bg-[#DF5B5B] border-[#DF5B5B] text-white"
                          : "bg-white border-black"
                      }`}
                    >
                      {question.questionNumber}
                    </div>
                  ))
                ) : (
                  <p className="mt-4">Вопросы недоступны</p>
                )}
              </div>

              {selectedTicket &&
                Array.isArray(selectedTicket.questions) &&
                selectedTicket.questions.length > 0 && (
                  <div className="mt-6 flex flex-col gap-2">
                    {selectedTicket.questions
                      .filter((q) => q.questionNumber === activeQuestion)
                      .map((question) => (
                        <div key={question._id}>
                          {question.imageUrl && (
                            <img
                              src={getImageUrl(question.imageUrl)}
                              alt=""
                              className="mb-4"
                            />
                          )}
                          <div className="bg-gray-100 px-3 py-4 gap-4 rounded-xl flex flex-col">
                            <p>{question.text}</p>
                            <div className="flex items-center w-full justify-between gap-2">
                              <div
                                className="hint"
                                onClick={() => setShowClue(true)}
                              >
                                <img src={clue} alt="" />
                                <p>Подсказка</p>
                              </div>
                              <div
                                className="video"
                                onClick={() => handleOpenVideo()}
                              >
                                <img src={play} alt="" />
                                <p className="w-full">Видео-разбор вопроса</p>
                              </div>
                            </div>
                          </div>
                          {Array.isArray(question.options) &&
                            question.options.map((option) => (
                              <Button
                                key={option._id || option.text}
                                Sellect
                                className={`rounded-3xl w-full mt-2 py-5 text-start ${
                                  answerError && selectedOption
                                    ? option.text === selectedOption.text &&
                                      !selectedOption.isCorrect
                                      ? "bg-[#D48585] text-white"
                                      : option.isCorrect
                                      ? "bg-[#B7F2BD]"
                                      : "bg-blue-100"
                                    : "bg-blue-100 active:bg-[#85A8D4] active:text-white"
                                }`}
                                onClick={() => handleAnswer(option)}
                                disabled={answerError}
                              >
                                {option.text || "Ответ отсутствует"}
                              </Button>
                            ))}
                          <br />
                          <br />
                          <br />
                          <br />

                          {answerError && (
                            <div
                              ref={errorSectionRef}
                              className="flex flex-col gap-3 mt-5"
                            >
                              <h1 className="font-500 text-xl">
                                Вы ответили неверно
                              </h1>
                              <div className="flex gap-2 px-3.5 py-5 bg-gray-100 rounded-xl">
                                Правильный ответ:{" "}
                                <b>
                                  {question.options.find(
                                    (option) => option.isCorrect
                                  )?.text || "Не найден"}
                                </b>
                              </div>
                              <p>{question.hint}</p>
                              <button
                                onClick={
                                  activeQuestion === 20
                                    ? () =>
                                        navigate(
                                          `/tickets/decide/${id}/results`
                                        )
                                    : handleNextQuestion
                                }
                                className="w-full bg-[#4B46A4] py-4 text-white rounded-xl mt-2"
                              >
                                {activeQuestion === 20
                                  ? "Посмотреть результаты"
                                  : "Следующий вопрос"}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
            </>
          )}
          <br />
          <br />
          <br />
        </div>
      </Container>
      <Drawer
        visible={showClue}
        onClose={handleClick}
        placement="bottom"
        className="geist-ui-drawer"
        color="purple"
      >
        <Drawer.Title className="geist-ui-drawer-title">Подсказка</Drawer.Title>
        <Drawer.Content>
          <div className="flex flex-col items-center gap-5">
            {selectedTicket &&
            Array.isArray(selectedTicket.questions) &&
            selectedTicket.questions.length > 0 ? (
              <div className="mt-6 flex flex-col gap-2">
                {selectedTicket.questions
                  .filter((q) => q.questionNumber === activeQuestion)
                  .map((question) => (
                    <p
                      key={question._id}
                      className="bg-[#5550bc] py-4 px-3 rounded-2xl text-white"
                    >
                      {question.hint}
                    </p>
                  ))}
              </div>
            ) : null}
          </div>
        </Drawer.Content>
      </Drawer>
      <Drawer
        visible={showVideo}
        onClose={handleClick}
        placement="bottom"
        className="geist-ui-drawer"
      >
        <Drawer.Title className="geist-ui-drawer-title">
          Разбор вопроса
        </Drawer.Title>
        <Drawer.Content>
          {selectedTicket &&
          Array.isArray(selectedTicket.questions) &&
          selectedTicket.questions.length > 0 ? (
            <div className="mt-6 flex flex-col gap-2">
              {selectedTicket.questions
                .filter((q) => q.questionNumber === activeQuestion)
                .map((question) => (
                  <div
                    key={question._id}
                    className="flex flex-col items-center gap-5"
                  >
                    <p className="bg-[#5550bc] py-4 px-3 rounded-2xl w-full text-white">
                      {question.text}
                    </p>
                    <div className="w-full h-[200px]">
                      <VideoPlayer
                        src={`${MEDIA_URL}${question.videoUrl}`}
                      />
                    </div>

                    {/* <Link to={`${question.videoUrl}`} className="w-full">
                      <div className="h-[200px] w-full bg-black rounded-xl flex items-center justify-center">
                        <img src={Play} className="w-[50px]" alt="" />
                      </div>
                    </Link> */}
                  </div>
                ))}
              <br />
            </div>
          ) : null}
        </Drawer.Content>
      </Drawer>
    </>
  );
};
