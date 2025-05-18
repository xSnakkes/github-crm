import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { Transaction } from 'sequelize';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async create(
    userData: CreateUserDTO,
    transaction?: Transaction,
  ): Promise<User> {
    try {
      return await this.userRepository.create(userData, {
        transaction,
      });
    } catch (error: any) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);

      if (error.name === 'SequelizeUniqueConstraintError') {
        const field = error.errors?.[0]?.path ?? 'unknown field';
        throw new HttpException(
          `${field} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Failed to create user: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findByPk(id, {
      attributes: { exclude: ['created_at', 'updated_at', 'password'] },
    });

    return user.dataValues;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  async getAll() {
    const users = await this.userRepository.findAll();

    return users;
  }
}
