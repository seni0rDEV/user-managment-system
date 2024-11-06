export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole
}

export type UserRole = 'user'|'superadmin'|'admin'

export interface LoginPayload {
  email: string;
  password: string;
  isAdmin: boolean; // new feature
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
export interface ApiResponse<T> {
  status?: boolean;
  message?: string;
  error?: string;
  data: T;
  token?: string;
  // password: string;
}
