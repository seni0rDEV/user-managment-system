

export interface User {
  _id: string;
  dob: string;
  verified: boolean;
  doj: string;
  name: string;
  mobile: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  token: string;
  createdAt?: Date;
  role: 'user' | 'admin' | 'superadmin';
}