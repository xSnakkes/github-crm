import type { IApiClient } from "..";
import type { ISignInData, ISignUpData, IUserResponse } from "./model";

export interface IAuthApi {
  signUp(data: ISignUpData): Promise<IUserResponse>;
  signIn(data: ISignInData): Promise<IUserResponse>;
  signOut(): Promise<void>;
  getAuthUser(): Promise<IUserResponse>;
}

export class AuthApi implements IAuthApi {
  private readonly apiClient: IApiClient;
  private readonly baseUrl: string = "/auth";

  constructor(apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async signUp(data: ISignUpData): Promise<IUserResponse> {
    return this.apiClient.post<IUserResponse>(`${this.baseUrl}/sign-up`, data);
  }

  async signIn(data: ISignInData): Promise<IUserResponse> {
    return this.apiClient.post<IUserResponse>(`${this.baseUrl}/login`, data);
  }

  async signOut(): Promise<void> {
    return this.apiClient.post<void>(`${this.baseUrl}/sign-out`, {});
  }

  async getAuthUser(): Promise<IUserResponse> {
    return this.apiClient.get<IUserResponse>(this.baseUrl);
  }
}
