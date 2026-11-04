export interface IPaymentCreate {
  status: boolean;
  paymentId: string;
  paymentUrl: string;
  amount: number;
  paymentType: string;
  email?: string;
}
