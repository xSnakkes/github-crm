import axios, { AxiosError, type AxiosInstance } from "axios";

export interface IApiClient {
  get<T>(url: string, params?: any): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
  put<T>(url: string, data: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
  patch<T>(url: string, data: any): Promise<T>;
}

export class ApiClient implements IApiClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string, timeout: number = 10000) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      withCredentials: true,
    });
  }

  async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await this.axiosInstance.get(url, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async put<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.put(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.axiosInstance.delete(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async patch<T>(url: string, data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.patch(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Response error:", axiosError.response.data);
        console.error("Status:", axiosError.response.status);
      } else if (axiosError.request) {
        console.error("Request error:", axiosError.request);
      } else {
        console.error("Error:", axiosError.message);
      }
    } else {
      console.error("Unexpected error:", error);
    }
  }
}
