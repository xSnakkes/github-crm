import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './repository.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Repository } from './model/repository.model';

@Module({
  imports: [SequelizeModule.forFeature([Repository]), HttpModule],
  controllers: [RepositoryController],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
