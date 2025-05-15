import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LogInWithCredentialsGuard } from './guards/login-credentionals.guard';
import { RequestWithUser } from './interface/request-with-user.interface';
import {
  ApiAuthenticate,
  ApiLogin,
  ApiSignOut,
  ApiSignUp,
} from './swagger/auth.decorators';
import { Request, Response } from 'express';
import passport from 'passport';
import { CookieAuthenticationGuard } from './guards/cookie-auth.guard';
import { SESSION_COOKIE_NAME } from 'src/common/constants/session';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { SignInDTO } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiSignUp()
  @Post('sign-up')
  async register(
    @Req() req: Request,
    @Body() signUpDTO: CreateUserDTO,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.createUser(signUpDTO);

      req.body.email = signUpDTO.email;
      req.body.password = signUpDTO.password;

      return new Promise((resolve, reject) =>
        passport.authenticate('local', {})(req, res, (error) => {
          if (error) {
            reject(
              new HttpException(
                'Authentication failed',
                HttpStatus.UNAUTHORIZED,
              ),
            );
            return;
          }

          res.status(HttpStatus.CREATED).send(req.user);
          resolve(user);
        }),
      );
    } catch (error: any) {
      throw new HttpException(
        'Registration failed: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiLogin()
  @Post('login')
  @UseGuards(LogInWithCredentialsGuard)
  async login(
    @Req() request: RequestWithUser,
    @Body() signInDTO: SignInDTO,
    @Res() res: Response,
  ) {
    const user = request.user;

    try {
      await this.authService.revokeActiveSessions(user.id, request.session.id);
      res.status(HttpStatus.OK).send(user);
    } catch (error: any) {
      throw new HttpException(
        'Login failed: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiAuthenticate()
  @UseGuards(CookieAuthenticationGuard)
  @Get()
  async authenticate(@Req() request: RequestWithUser) {
    try {
      return await this.userService.findOne(request.user.id);
    } catch (error: any) {
      throw new HttpException(
        'Authentication failed: ' + error.message,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @ApiSignOut()
  @UseGuards(CookieAuthenticationGuard)
  @Post('sign-out')
  async logOut(@Req() request: RequestWithUser, @Res() res: Response) {
    try {
      request.session.destroy(() => {
        res.clearCookie(SESSION_COOKIE_NAME).sendStatus(HttpStatus.OK);
      });
    } catch (error: any) {
      throw new HttpException(
        'Logout failed: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
