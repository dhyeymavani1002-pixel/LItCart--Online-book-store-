export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface LoginFormValue {
  email: string;
  password: string;
}

export interface SignupFormValue {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
