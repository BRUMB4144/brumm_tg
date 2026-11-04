import { axiosInstance } from "../API/axios.api";
import { IAnswer, IExamStatus, ITicket } from "../types/exam.types";
import { IMarathon, MarathonResult } from "../types/marathon.types";

export const examService = {
  async startExam() {
    const token = localStorage.getItem("id");
    if (!token) {
      throw new Error("Пользователь не найден в localStorage");
    }
    const response = await axiosInstance.post("exam/start", {
      userId: token,
    });
    return response.data;
  },
  async sendAnswer(
    examId: string,
    payload: IAnswer
  ): Promise<IAnswer> {
    const response = await axiosInstance.post<IAnswer>(
      `exam/${examId}/answer`,
      payload
    );
    return response.data;
  },
  async status(examId: string): Promise<IExamStatus> {
    const response = await axiosInstance.get<IExamStatus>(`exam/${examId}`);
    return response.data;
  },
  async share(examId: string) {
    const response = await axiosInstance.get(`exam/${examId}/share`);
    return response.data;
  },
  async selectTicket(): Promise<ITicket> {
    const token = localStorage.getItem("id");
    const response = await axiosInstance.post<ITicket>(
      `exam/select-ticket`,
      { userId: token }
    );
    return response.data;
  },

  async result(examId: string) {
    const response = await axiosInstance.get(`exam/${examId}/results`);
    return response.data;
  },
  async marathon(type: string) {
    const userId = localStorage.getItem("id");
    const response = await axiosInstance.post("exam/marathon/start", {
      userId: userId,
      type: type,
    });
    return response.data;
  },

  async marathonNewQuestions() {
    const response = await axiosInstance.get<IMarathon>("exam/questions/new");
    return response.data;
  },
  async marathonProgress() {
    const userId = localStorage.getItem("id");
    const response = await axiosInstance.get(
      `exam/marathon/progress?userId=${userId}`
    );
    return response.data;
  },
  async marathonResult(marathonId: string): Promise<MarathonResult> {
    const response = await axiosInstance.post("exam/marathon/result", {
      marathonId,
    });
    return response.data as MarathonResult;
  },
  async answerMarathon(examId: string, payload: IAnswer) {
    const response = await axiosInstance.post<IAnswer>(
      `exam/marathon/${examId}/answer`,
      payload
    );
    return response.data;
  },
  async shareStory(
    correct: string,
    mistakes: string,
    time: string,
    type: string
  ) {
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
  },
};
