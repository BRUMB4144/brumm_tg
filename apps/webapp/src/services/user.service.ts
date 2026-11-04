import { axiosInstance } from '../API/axios.api';
import { IProfile, IReferals } from '../types/types';
export interface NotificationDto { _id: string; title: string; description: string; createdAt: string; link?: string }
interface StatusDto { status: boolean; message: string }
type PaymentDto = { status: false; message: string } | { status: true; paymentId: string; paymentUrl: string; amount: number; paymentType: string };
interface SubscriptionPrices { monthPrice: number; halfYearPrice: number; yearPrice: number }
const userId = () => localStorage.getItem('id');

export const userService = {
  async getProfile(): Promise<IProfile> {
    return (await axiosInstance.get<IProfile>('users/profile')).data;
  },
  async getNotifications(): Promise<NotificationDto[]> {
    return (await axiosInstance.get<NotificationDto[]>(`notifications/${userId()}`)).data;
  },
  async deleteNotification(id: string): Promise<StatusDto> {
    return (await axiosInstance.delete<StatusDto>('notifications', { data: { notificationId: id, userId: userId() } })).data;
  },
  async getReferals(): Promise<IReferals> {
    return (await axiosInstance.get<IReferals>(`users/referals/${userId()}`)).data;
  },
  async createPayment(amount: number, description: string, paymentType: string, email: string): Promise<PaymentDto> {
    return (await axiosInstance.post<PaymentDto>('payments/createPayment', { amount, description, paymentType, email, userId: userId() })).data;
  },
  async promoSend(promoId: string): Promise<StatusDto> {
    return (await axiosInstance.post<StatusDto>('payments/usePromocode', { promoId, userId: userId() })).data;
  },
  async getSubscriptionPrice(): Promise<SubscriptionPrices> {
    return (await axiosInstance.get<SubscriptionPrices>('subscription/getSubscription')).data;
  },
};
