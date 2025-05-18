export interface ISignUpData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface ISignInData {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}
