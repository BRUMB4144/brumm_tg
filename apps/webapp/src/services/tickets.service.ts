import { axiosInstance } from "../API/axios.api";
import { ITicket, ThemeQuestion } from "../types/tickets.types";

export const ticketsService = {
  async fetchTickets() {
    try {
      const response = await axiosInstance.get("tickets");
      return response.data;
    } catch {
      console.log("Ошбика при получении билетов");
    }
  },
  async fetchThemes() {
    try {
      const response = await axiosInstance.get("tickets/categories");
      return response.data;
    } catch {
      console.log("Ошбика при получении тем");
    }
  },
  async answer(
    number: number,
    answerData: { answers: { questionId: string; selectedOption: string }[] }
  ) {
    try {
      const response = await axiosInstance.post(
        `tickets/${number}/submit`,
        answerData
      );
      return response.data;
    } catch (err) {
      console.error("Ошибка при отправке ответа:", err);
      throw err;
    }
  },
  async answerTheme(
    category: string,
    answerData: { answers: { questionId: string; selectedOption: string }[] }
  ) {
    try {
      const response = await axiosInstance.post(
        `tickets/category/${category}/submit`,
        answerData
      );
      return response.data;
    } catch (err) {
      console.error("Ошибка при отправке ответа:", err);
      throw err;
    }
  },

  async getTicket(number: number) {
    try {
      const response = await axiosInstance.get<ITicket>(`tickets/${number}`);
      return response.data;
    } catch {
      console.log("Ошбика при получении билетов");
    }
  },
  async getTheme(category: string) {
    try {
      const response = await axiosInstance.get<ThemeQuestion[]>(
        `tickets/category/${category}`
      );
      return response.data;
    } catch {
      console.log("Ошбика при получении билетов");
    }
  },
  async getTicketByThemes(category: string) {
    try {
      const response = await axiosInstance.get<ThemeQuestion[]>(
        `tickets/category/${category}`
      );
      return response.data;
    } catch {
      console.log("Ошбика при получении билетов");
    }
  },
  async getRandomTicket() {
    try {
      const response = await axiosInstance.get("tickets/random-ticket");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении билетов:", error);
      throw error;
    }
  },
  async progress() {
    try {
      const response = await axiosInstance.get(`tickets/progress`);
      return response.data;
    } catch {
      console.log("ошбика при получении прогресса");
    }
  },
  async progressThemes() {
    try {
      const response = await axiosInstance.get(`tickets/category/progress`);
      return response.data;
    } catch {
      console.log("ошбика при получении прогресса");
    }
  },
  async startTickets(number: number) {
    try {
      const response = await axiosInstance.post(`tickets/${number}/start`);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  async startTicketsTheme(category: string) {
    try {
      const response = await axiosInstance.post(
        `tickets/category/${category}/start`
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  async getTicketReview() {
    const userId = localStorage.getItem("id");
    try {
      const response = await axiosInstance.get(
        `tickets/getTicketReview/${userId}`
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  async getQuestionReview() {
    const userId = localStorage.getItem("id");
    try {
      const response = await axiosInstance.get(
        `tickets/getQuestionReview/${userId}`
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
};
