import { HttpException } from '@nestjs/common';

interface IError {
  message: string;
  status?: number;
}

export const ErrorHandler = (error: IError) => {
  const status = error?.status || 400;
  throw new HttpException(error.message, status, {
    cause: new Error(error.message),
  });
};
