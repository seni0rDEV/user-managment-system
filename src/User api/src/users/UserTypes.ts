

export interface User {
  _id: string;
  dob: string;
  doj: string;
  name: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  token: string;
  createdAt?: Date;
  role: 'user' | 'admin' | 'superadmin';
}