import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocalSerializer } from '../serializers/local.serializer';
import { AuthUser } from './model/auth_user.model';
import { LocalStrategy } from '../strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/model/user.model';

@Module({
  imports: [SequelizeModule.forFeature([AuthUser, User]), UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalSerializer, LocalStrategy],
})
export class AuthModule {}
