export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface IEmployee {
  _id?: string;
  role: 'user' | 'admin' | 'superadmin';
  name: string;
  verified: boolean;
  email: string;
  resetPasswordToken: string;
  mobile: string;
  dob: string;
  doj: string;
}
