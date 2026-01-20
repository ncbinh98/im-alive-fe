export interface EmergencyContact {
  name: string;
  telegramId: string;
  email: string;
  message: string;
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  emergencyContacts: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface ListUsers {
  items: UserData[];
  page: number;
  limit: number;
  total: number;
}
