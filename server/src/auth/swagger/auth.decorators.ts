import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { SignInDTO, SignUpDTO } from '../dto';
import { SESSION_COOKIE_NAME } from 'src/common/constants/session';
import { AuthResponseExample } from './auth.examples';

export function ApiLogin() {
  return applyDecorators(
    ApiBody({ type: SignInDTO }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: `Success sign-in. Regenerates session, adds ${SESSION_COOKIE_NAME} to cookie, and returns object with all data`,
      schema: {
        example: AuthResponseExample,
      },
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Wrong credentials provided or other validation errors.',
    }),
    ApiInternalServerErrorResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'An internal server error occurred during the login process.',
    }),
  );
}

export function ApiSignUp() {
  return applyDecorators(
    ApiBody({ type: SignUpDTO }),
    ApiOkResponse({
      status: HttpStatus.CREATED,
      description: `Success sign-up. Regenerates session, adds ${SESSION_COOKIE_NAME} to cookie, and returns object with all data`,
      schema: {
        example: AuthResponseExample,
      },
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Sign up failed due to validation errors or the user already exists.',
    }),
    ApiInternalServerErrorResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'An internal server error occurred during the sign-up process.',
    }),
  );
}

export function ApiAuthenticate() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      description: 'Returns the currently signed in user.',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Returns object with all data of the authenticated user.',
      schema: {
        example: AuthResponseExample,
      },
    }),
    ApiForbiddenResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'The request is missing authentication credentials or the session is invalid.',
    }),
    ApiInternalServerErrorResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description:
        'An internal server error occurred while retrieving user data.',
    }),
  );
}

export function ApiSignOut() {
  return applyDecorators(
    ApiCookieAuth(),
    ApiOperation({
      description: `Destroy ${SESSION_COOKIE_NAME} cookie and sign out the user.`,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Sign out successful, and the session cookie is removed.',
    }),
    ApiInternalServerErrorResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'An internal server error occurred during sign-out.',
    }),
  );
}
