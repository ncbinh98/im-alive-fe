export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListUsers {
  items: UserData[];
  page: number;
  limit: number;
  total: number;
}
