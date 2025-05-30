import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { config } from './swagger/swagger.config';
import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import session from 'express-session';
import { SESSION_COOKIE_NAME } from './common/constants/session';
import { randomUUID } from 'crypto';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { corsOptions } from './utils/cors/cors.options';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const configService = app.get(ConfigService);

  const NODE_ENV = configService.get('NODE_ENV');
  const PORT = configService.get('PORT');

  if (NODE_ENV !== 'production') {
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.enableCors(corsOptions);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  try {
    const redisUrl = configService.get('REDIS_URL');
    const logger = new Logger('Redis');
    logger.log(`Connecting to Redis at ${redisUrl}`);

    const redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          logger.log(`Redis reconnect attempt: ${retries}`);
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Connection Error: ', err);
    });

    redisClient.on('connect', () => {
      logger.log('Connected to Redis successfully');
    });

    await redisClient.connect();

    const redisStore = new RedisStore({
      client: redisClient,
      prefix: '',
    });

    app.use(
      session({
        store: redisStore,
        secret: configService.get<string>('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
        name: SESSION_COOKIE_NAME,
        proxy: true,
        cookie: {
          secure: configService.get<string>('NODE_ENV') === 'production',
          sameSite:
            configService.get<string>('NODE_ENV') === 'production'
              ? 'strict'
              : 'lax',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        },
        genid: (req) => {
          const id = randomUUID();
          const userId = (req.user as any)?.id ?? 'anonymous';
          return `sid:${userId}:${id}`;
        },
      }),
    );

    app.set('trust proxy', 1);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(PORT, () => {
      logger.verbose(`Server running, listening on port ${PORT}`);
    });
  } catch (error) {
    const logger = new Logger('Bootstrap');
    logger.error('Application failed to start', error);
    process.exit(1);
  }
}
bootstrap();
