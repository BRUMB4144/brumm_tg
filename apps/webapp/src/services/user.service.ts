import { axiosInstance } from "../API/axios.api";
import { IProfile } from "../types/types";

export const userService = {
  async getProfile(): Promise<IProfile | undefined> {
    try {
      const response = await axiosInstance.get<IProfile>(`users/profile`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
    }
  },
  async getNotifications() {
    try {
      const userId = localStorage.getItem("id");
      const response = await axiosInstance.get(`notifications/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении уведомлений:", error);
    }
  },
  async deleteNotification(id: string) {
    try {
      const userId = localStorage.getItem("id");
      const response = await axiosInstance.delete(`notifications`, {
        data: {
          notificationId: id,
          userId: userId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при удалении уведомления:", error);
    }
  },
  async getReferals() {
    try {
      const userId = localStorage.getItem("id");
      const response = await axiosInstance.get(`users/referals/${userId}`, {
        data: {
          userId: userId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка при удалении уведомления:", error);
    }
  },
  async createPayment(
    amount: number,
    description: string,
    paymentType: string,
    email: string
  ) {
    try {
      const response = await axiosInstance.post(`payments/createPayment`, {
        amount,
        description,
        paymentType,
        email,
        userId: localStorage.getItem("id"),
      });
      return response.data;
    } catch (error) {
      console.log(error, "Ошибка создании платежа");
    }
  },
  async promoSend(promoId: string) {
    try {
      const userId = localStorage.getItem("id");
      const response = await axiosInstance.post(`payments/usePromocode`, {
        promoId: promoId,
        userId: userId,
      });
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
  async getSubscriptionPrice() {
    try{
      const response = await axiosInstance.get(`admin/getSubscription`)
      return response.data
    }catch(err){
      console.log(err)
    }
  }
};
