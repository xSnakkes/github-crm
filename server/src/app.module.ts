import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import passport from 'passport';
import pg from 'pg';
import { AuthModule } from './auth/auth.module';
import { AuthUser } from './auth/model/auth_user.model';
import { RedisOptions } from './common/configs/redis.config';
import { RepositoryModule } from './repository/repository.module';
import { User } from './user/model/user.model';
import { UserModule } from './user/user.module';
import { Repository } from './repository/model/repository.model';

@Module({
  imports: [
    RepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        dialectModule: pg,
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        dialectOptions:
          configService.get('NODE_ENV') === 'production'
            ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: true,
                },
              }
            : {},
        define: {
          underscored: true,
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
        models: [User, AuthUser, Repository],
      }),
    }),
    AuthModule,
    UserModule,
    RepositoryModule,

    CacheModule.registerAsync(RedisOptions),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(passport.initialize(), passport.session()).forRoutes('*');
  }
}
