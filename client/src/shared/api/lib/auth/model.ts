export interface SignUpData {
  first_name: string;
  last_name: string;
  email: string;
  nickname: string;
  phone: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}
