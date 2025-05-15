import type { IApiClient } from "..";
import type { SignInData, SignUpData, UserResponse } from "./model";

export interface IAuthApi {
  signUp(data: SignUpData): Promise<UserResponse>;
  signIn(data: SignInData): Promise<UserResponse>;
  signOut(): Promise<void>;
  getAuthUser(): Promise<UserResponse>;
}

export class AuthApi implements IAuthApi {
  private readonly apiClient: IApiClient;
  private readonly baseUrl: string = "/auth";

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async signUp(data: SignUpData): Promise<UserResponse> {
    return this.apiClient.post<UserResponse>(`${this.baseUrl}/sign-up`, data);
  }

  async signIn(data: SignInData): Promise<UserResponse> {
    return this.apiClient.post<UserResponse>(`${this.baseUrl}/login`, data);
  }

  async signOut(): Promise<void> {
    return this.apiClient.post<void>(`${this.baseUrl}/sign-out`, {});
  }

  async getAuthUser(): Promise<UserResponse> {
    return this.apiClient.get<UserResponse>(this.baseUrl);
  }
}
