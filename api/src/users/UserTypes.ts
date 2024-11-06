

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  token: string;
  createdAt?: Date;
  role: 'user' | 'admin' | 'superadmin';
}