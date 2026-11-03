import { axiosInstance } from "../API/axios.api";
import { IAnswer, IExamStatus, ITicket } from "../types/exam.types";
import { IMarathon, MarathonResult } from "../types/marathon.types";

export const examService = {
  async startExam() {
    try {
      const token = localStorage.getItem("id");
      if (!token) {
        throw new Error("Пользователь не найден в localStorage");
      }
      const response = await axiosInstance.post("exam/start", {
        userId: token,
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при старте экзамена", error);
      throw error;
    }
  },
  async sendAnswer(
    examId: string,
    payload: IAnswer
  ): Promise<IAnswer | undefined> {
    try {
      const response = await axiosInstance.post<IAnswer>(
        `exam/${examId}/answer`,
        payload
      );
      return response.data;
    } catch {
      console.error("Ошибка при ответе на экзамен");
    }
  },
  async status(examId: string): Promise<IExamStatus | undefined> {
    try {
      const response = await axiosInstance.get<IExamStatus>(`exam/${examId}`);
      return response.data;
    } catch {
      console.error("Ошибка при получении статуса эказмена");
    }
  },
  async share(examId: string) {
    try {
      const response = await axiosInstance.get(`exam/${examId}/share`);
      return response.data;
    } catch (err) {
      return err;
    }
  },
  async selectTicket(): Promise<ITicket | undefined> {
    try {
      const token = localStorage.getItem("id");
      const response = await axiosInstance.post<ITicket>(
        `exam/select-ticket`,
        { userId: token },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch {
      console.error("Ошибка при получении билета");
    }
  },

  async result(examId: string) {
    try {
      const response = await axiosInstance.get(`exam/${examId}/results`);
      return response.data;
    } catch {
      console.error("Ошибка при получении результата");
    }
  },
  async marathon(type: string) {
    try {
      const userId = localStorage.getItem("id");
      const response = await axiosInstance.post("exam/marathon/start", {
        userId: userId,
        type: type,
      });
      return response.data;
    } catch (error) {
      console.error("Не удается получить доступ к марафону", error);
    }
  },

  async marathonNewQuestions() {
    try {
      const response = await axiosInstance.get<IMarathon>("exam/questions/new");
      return response.data;
    } catch (error) {
      console.error("Не удается получить доступ к марафону", error);
    }
  },
  async marathonProgress() {
    const userId = localStorage.getItem("id");
    try {
      const response = await axiosInstance.get(
        `exam/marathon/progress?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Не удается получить доступ к марафону", error);
    }
  },
  async marathonResult(marathonId: string): Promise<MarathonResult> {
    try {
      const response = await axiosInstance.post("exam/marathon/result", {
        marathonId,
      });
      return response.data as MarathonResult;
    } catch (error) {
      console.error("Не удалось получить результат марафона", error);
      throw error;
    }
  },
  async answerMarathon(examId: string, payload: IAnswer) {
    try {
      const response = await axiosInstance.post<IAnswer>(
        `exam/marathon/${examId}/answer`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Не удается получить доступ к марафону", error);
    }
  },
  async shareStory(
    correct: string,
    mistakes: string,
    time: string,
    type: string
  ) {
    try {
      const response = await axiosInstance.post(
        `exam/marathon/generateTemplate`,
        {
          correct: correct,
          mistakes: mistakes,
          time: time,
          type: type,
        }
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
};
