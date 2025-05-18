import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RepositoryService } from './repository.service';
import { AddRepositoryDto, RepositoryQueryDto } from './dto/repository.dto';
import { RequestWithUser } from '../auth/interface/request-with-user.interface';
import { CookieAuthenticationGuard } from 'src/auth/guards';

@ApiTags('repositories')
@Controller('repositories')
@UseGuards(CookieAuthenticationGuard)
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all repositories for current user' })
  @ApiResponse({ status: 200, description: 'Returns all repositories' })
  async getAllRepositories(
    @Request() req: RequestWithUser,
    @Query() query: RepositoryQueryDto,
  ) {
    return this.repositoryService.findAllByUserId(req.user.id, query);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new repository' })
  @ApiResponse({ status: 201, description: 'Repository added successfully' })
  async addRepository(
    @Request() req: RequestWithUser,
    @Body() addRepositoryDto: AddRepositoryDto,
  ) {
    return this.repositoryService.addRepository(req.user.id, addRepositoryDto);
  }

  @Put(':id/refresh')
  @ApiOperation({ summary: 'Update repository data from GitHub' })
  @ApiResponse({ status: 200, description: 'Repository updated successfully' })
  async updateRepository(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.repositoryService.updateRepository(req.user.id, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a repository' })
  @ApiResponse({ status: 204, description: 'Repository deleted successfully' })
  async deleteRepository(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.repositoryService.deleteRepository(req.user.id, id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search GitHub repositories' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  async searchRepositories(@Query('query') query: string) {
    return this.repositoryService.searchGitHubRepositories(query);
  }
}
