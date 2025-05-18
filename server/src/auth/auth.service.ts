import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'cache-manager';
import bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AuthUser } from './model/auth_user.model';
import { PostgresErrorCode } from '../database/postgres-error-codes.enum';
import { SignInDTO } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/model/user.model';
import { SignUpDTO } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectModel(AuthUser) private readonly authRepository: typeof AuthUser,
    private readonly userService: UserService,
    private readonly sequelize: Sequelize,
  ) {}

  async createAuth(email: string, password: string, t: Transaction) {
    try {
      return await this.authRepository.create(
        {
          email,
          password,
        },
        { transaction: t },
      );
    } catch (error: any) {
      if (
        error.name === 'SequelizeUniqueConstraintError' ||
        error.name === PostgresErrorCode.UniqueError
      ) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }
      this.logger.error(
        `Error creating auth user: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Error creating user: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createUser(signUpDTO: SignUpDTO): Promise<any> {
    const hashedPassword = await bcrypt.hash(signUpDTO.password, 10);
    try {
      const result = await this.sequelize.transaction(async (transaction) => {
        const authUser = await this.authRepository.create(
          {
            email: signUpDTO.email,
            password: hashedPassword,
          },
          { transaction },
        );

        if (!authUser?.id) {
          throw new Error('Failed to create auth user record');
        }

        this.logger.log(`Created auth_user with id: ${authUser.id}`);

        const userData = {
          first_name: signUpDTO.first_name,
          last_name: signUpDTO.last_name,
          email: signUpDTO.email,
          phone: signUpDTO.phone,
          password: hashedPassword,
          auth_user_id: authUser.id,
        };

        this.logger.log(`Creating user with data: ${JSON.stringify(userData)}`);

        const user = await this.userService.create(userData, transaction);

        return user;
      });

      return result;
    } catch (error: any) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new HttpException(
        'Error creating user: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async revokeActiveSessions(user_id: number, sessionId: string) {
    try {
      const keys = await this.cacheManager.store.keys(`sid:${user_id}:*`);

      const filteredKeys = keys.filter(
        (key) => key !== `sid:${user_id}:${sessionId}`,
      );
      if (filteredKeys.length) {
        await this.cacheManager.store.mdel(...filteredKeys);
      }
    } catch (error: any) {
      this.logger.error(
        `Error revoking sessions: ${error.message}`,
        error.stack,
      );
    }
  }

  public async getAuthenticatedUser(signInDTO: Omit<SignInDTO, 'rememberMe'>) {
    try {
      const { email, password } = signInDTO;
      let user: User;

      user = await this.userService.findByEmail(email);

      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const { auth_user } = user;

      if (!auth_user) {
        throw new HttpException(
          'Authentication record not found',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const passwordMatching = await this.verifyPassword(
        password,
        auth_user.password,
      );

      if (!passwordMatching)
        throw new UnauthorizedException('Wrong credentials provided.');

      delete user.auth_user;
      delete user.password;
      delete user.auth_user_id;
      return user;
    } catch (error: any) {
      this.logger.error(
        `Error authenticating user: ${error.message}`,
        error.stack,
      );

      if (
        error instanceof HttpException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new HttpException(
        'Authentication failed. Please try again later.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
