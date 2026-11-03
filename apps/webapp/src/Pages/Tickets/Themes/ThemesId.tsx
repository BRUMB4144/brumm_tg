import { useParams, useNavigate, Link } from "react-router-dom";
import Container from "../../../components/Layouts/Container/Container";
import { useEffect, useState, useRef } from "react";
import { Button } from "../../../components/ui/Button/Button";
import { ticketsService } from "../../../services/tickets.service";
import { Drawer } from "@geist-ui/react";
import clue from "../../../assets/16/clue.svg";
import play from "../../../assets/16/play.svg";
import Play from "../../../assets/Reopen/play.png";
import { VideoPlayer } from "../../../components/Layouts/VideoPlayer/VideoPlayer";
import { MEDIA_URL } from "../../../config";
import { ThemeQuestion } from "../../../types/tickets.types";

interface Option {
  text: string;
  isCorrect: boolean;
  _id?: string;
}

interface AnswerResponse {
  message: string;
  results: {
    category: string;
    totalQuestions: number;
    correctAnswers: number;
    mistakes: number;
    successRate: number;
    answers: Array<{
      questionId: string;
      selectedOption: string;
      isCorrect: boolean;
    }>;
  };
}

export const ThemesId = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<ThemeQuestion[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<number>(1);
  const [showClue, setShowClue] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Map<number, boolean>>(new Map());
  const [submittedAnswers, setSubmittedAnswers] = useState<
    { questionId: string; selectedOption: string }[]
  >([]);
  const questionListRef = useRef<HTMLDivElement>(null);
  const getRutubeEmbedUrl = (videoUrl: string): string => {
    try {
      const url = new URL(videoUrl);
      const pathParts = url.pathname.split("/").filter((part) => part);
      const videoId = pathParts[pathParts.length - 1];
      const query = url.search;

      return `https://rutube.ru/play/embed/${videoId}${query}`;
    } catch (error) {
      console.error("Invalid video URL:", error);
      return videoUrl;
    }
  };
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await ticketsService.getTheme(id);
        setTheme(response);
      } catch (error) {
        console.error("Error fetching theme:", error);
      }
    };
    fetchTheme();
  }, [id]);

  useEffect(() => {
    if (questionListRef.current) {
      const activeElement = questionListRef.current.querySelector(
        `[data-question-number="${activeQuestion}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [activeQuestion]);

  const handleAnswer = async (option: Option) => {
    const currentIndex = activeQuestion - 1;
    const currentQuestion = theme[currentIndex];
    if (!currentQuestion) return;

    const newAnswer = {
      questionId: currentQuestion._id,
      selectedOption: option.text,
    };

    const correctOption = currentQuestion.options.find((opt) => opt.isCorrect);
    const isCorrect = correctOption
      ? option.text === correctOption.text
      : false;

    try {
      const response: AnswerResponse = await ticketsService.answerTheme(id, {
        answers: [newAnswer],
      });

      // Обновление состояния на основе локальной проверки
      setAnswers((prev) => new Map(prev).set(activeQuestion, isCorrect));
      setSubmittedAnswers((prev) => [...prev, newAnswer]);

      handleNextQuestion();
    } catch (error) {
      console.error("Error submitting answer:", error);
      // Переход к следующему вопросу даже при ошибке
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestion < theme.length) {
      setActiveQuestion(activeQuestion + 1);
    } else {
      navigate(`/tickets/themes/${id}/results`);
    }
  };

  const handleDrawerClose = () => {
    setShowClue(false);
    setShowVideo(false);
  };
  const getImageUrl = (imageUrl: string): string => {
    return imageUrl.startsWith("https://storage.watbot.ru") ? "" : imageUrl;
  };
  return (
    <Container>
      <div className="flex flex-col my-5">
        <p className="text-[#3942CF]">Вопросы по теме {id}</p>

        <div
          ref={questionListRef}
          className="flex gap-2 mt-4 overflow-x-auto py-2 scrollbar-thin"
        >
          {theme.map((item, index) => {
            const displayNumber = index + 1;
            return (
              <div
                key={item._id}
                data-question-number={displayNumber}
                onClick={() => setActiveQuestion(displayNumber)}
                className={`py-[6px] rounded-full border cursor-pointer text-black min-w-[40px] text-center ${
                  activeQuestion === displayNumber
                    ? "bg-blue-200 border-blue-500 text-[#5C8EC6]"
                    : answers.has(displayNumber)
                    ? answers.get(displayNumber)
                      ? "bg-[#5CC661] border-[#5CC661] text-white"
                      : "bg-[#DF5B5B] border-[#DF5B5B] text-white"
                    : "bg-white border-black"
                }`}
              >
                {displayNumber}
              </div>
            );
          })}
        </div>

        {/* Current question */}
        {theme.length > 0 && theme[activeQuestion - 1] ? (
          <div className="mt-6 flex flex-col gap-2">
            {(() => {
              const question = theme[activeQuestion - 1];
              return (
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
                    <div className="flex items-center w-full justify-between">
                      <div className="hint" onClick={() => setShowClue(true)}>
                        <img src={clue} alt="Подсказка" />
                        <p>Подсказка</p>
                      </div>
                      <div className="video" onClick={() => setShowVideo(true)}>
                        <img src={play} alt="Видео" />
                        <p className="w-full">Видео-разбор вопроса</p>
                      </div>
                    </div>
                  </div>
                  {question.options.map((option) => (
                    <Button
                      key={option._id || option.text}
                      className="rounded-xl w-full mt-2 py-5 bg-blue-100 text-start active:bg-[#85A8D4] active:text-white"
                      onClick={() => handleAnswer(option)}
                      disabled={answers.has(activeQuestion)}
                    >
                      {option.text || "Ответ отсутствует"}
                    </Button>
                  ))}
                </div>
              );
            })()}
            <br />
            <br />
            <br />
          </div>
        ) : (
          <p className="mt-5">Загрузка</p>
        )}
      </div>

      <Drawer
        visible={showClue}
        onClose={handleDrawerClose}
        placement="bottom"
        className="geist-ui-drawer"
      >
        <Drawer.Title className="geist-ui-drawer-title">Подсказка</Drawer.Title>
        <Drawer.Content>
          <div className="flex flex-col items-center gap-5">
            {theme[activeQuestion - 1] && (
              <p
                key={theme[activeQuestion - 1]._id}
                className="bg-[#5550bc] py-4 px-3 rounded-2xl text-white"
              >
                {theme[activeQuestion - 1].hint}
              </p>
            )}
          </div>
        </Drawer.Content>
      </Drawer>

      <Drawer
        visible={showVideo}
        onClose={handleDrawerClose}
        placement="bottom"
        className="geist-ui-drawer"
      >
        <Drawer.Title className="geist-ui-drawer-title">
          Разбор вопроса
        </Drawer.Title>
        <Drawer.Content>
          {theme[activeQuestion - 1] && (
            <div
              key={theme[activeQuestion - 1]._id}
              className="flex flex-col items-center gap-5"
            >
              <p className="bg-[#5550bc] py-4 px-3 rounded-2xl w-full text-white">
                {theme[activeQuestion - 1].text}
              </p>
              <div className="w-full h-[200px]">
                <VideoPlayer
                  src={`${MEDIA_URL}${
                    theme[activeQuestion - 1].videoUrl
                  }`}
                />
              </div>
              {/* <iframe
                allow="clipboard-write; autoplay"
                allowFullScreen
                src={getRutubeEmbedUrl(theme[activeQuestion - 1].videoUrl)}
                className="w-full h-[250px] rounded-xl"
              ></iframe> */}
            </div>
          )}
        </Drawer.Content>
      </Drawer>
    </Container>
  );
};
