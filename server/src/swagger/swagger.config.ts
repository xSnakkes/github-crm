import { DocumentBuilder } from '@nestjs/swagger';
import { corsDomains } from 'src/utils/cors/cors.domains';

export const config = new DocumentBuilder()
  .setTitle('API documentation')
  .setDescription('The API description')
  .setVersion('1.0')
  .addServer(corsDomains[0]) // local
  .addServer(corsDomains[1]) // staging
  .addServer(corsDomains[2]) // production
  .build();
