export interface IProfile {
  username: string;
  telegramId: string;
  avatar: string;
  subscription: ISubscription;
  progress: IProgress;
  firstLogin: string;
  createdAt: string;
}

export interface ISubscription {
  type: string;
  expiresAt: string;
  autoRenew: boolean;
  canView: string[];
}

export interface IProgress {
  percentage: number;
  ticketsCompleted: number;
  lessonsCompleted: number;
  totalTimeSpent: number;
  mistakes: number;
}

export interface IReferals {
  referalLink: string;
  referalCount: number;
  referalPurchases: number;
}
