import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const host = configService.get<string>('REDIS_HOST');
    const port = configService.get<number>('REDIS_PORT');

    return {
      store: redisStore,
      socket: {
        host,
        port,
      },
      ttl: configService.get<number>('REDIS_TTL') || 600,
    };
  },
};
