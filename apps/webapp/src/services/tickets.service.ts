import { axiosInstance } from "../API/axios.api";
import { ITicket, ThemeQuestion } from "../types/tickets.types";

export const ticketsService = {
  async fetchTickets() {
    const response = await axiosInstance.get("tickets");
    return response.data;
  },
  async fetchThemes() {
    const response = await axiosInstance.get("tickets/categories");
    return response.data;
  },
  async answer(
    number: number,
    answerData: { answers: { questionId: string; selectedOption: string }[] }
  ) {
    const response = await axiosInstance.post(
      `tickets/${number}/submit`,
      answerData
    );
    return response.data;
  },
  async answerTheme(
    category: string,
    answerData: { answers: { questionId: string; selectedOption: string }[] }
  ) {
    const response = await axiosInstance.post(
      `tickets/category/${category}/submit`,
      answerData
    );
    return response.data;
  },

  async getTicket(number: number) {
    const response = await axiosInstance.get<ITicket>(`tickets/${number}`);
    return response.data;
  },
  async getTheme(category: string) {
    const response = await axiosInstance.get<ThemeQuestion[]>(
      `tickets/category/${category}`
    );
    return response.data;
  },
  async getTicketByThemes(category: string) {
    const response = await axiosInstance.get<ThemeQuestion[]>(
      `tickets/category/${category}`
    );
    return response.data;
  },
  async getRandomTicket() {
    const response = await axiosInstance.get("tickets/random-ticket");
    return response.data;
  },
  async progress() {
    const response = await axiosInstance.get(`tickets/progress`);
    return response.data;
  },
  async progressThemes() {
    const response = await axiosInstance.get(`tickets/category/progress`);
    return response.data;
  },
  async startTickets(number: number) {
    const response = await axiosInstance.post(`tickets/${number}/start`);
    return response.data;
  },
  async startTicketsTheme(category: string) {
    const response = await axiosInstance.post(
      `tickets/category/${category}/start`
    );
    return response.data;
  },
  async getTicketReview() {
    const userId = localStorage.getItem("id");
    const response = await axiosInstance.get(
      `tickets/getTicketReview/${userId}`
    );
    return response.data;
  },
  async getQuestionReview() {
    const userId = localStorage.getItem("id");
    const response = await axiosInstance.get(
      `tickets/getQuestionReview/${userId}`
    );
    return response.data;
  },
};
