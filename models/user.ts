export interface User {
  _id: string;
  email: string;
  roles?: string[];
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UserStoreState {
  user: User | null;
  token: string | null;
}
