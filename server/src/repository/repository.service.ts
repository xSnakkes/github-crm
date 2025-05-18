import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { Repository } from './model/repository.model';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AddRepositoryDto, RepositoryQueryDto } from './dto/repository.dto';
import { Op } from 'sequelize';

@Injectable()
export class RepositoryService {
  private readonly logger = new Logger(RepositoryService.name);
  private readonly githubApiUrl = 'https://api.github.com';

  constructor(
    @InjectModel(Repository)
    private readonly repositoryModel: typeof Repository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAllByUserId(
    userId: number,
    query: RepositoryQueryDto,
  ): Promise<{
    items: Repository[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { search, page = 1, limit = 10 } = query;

    const where: any = { user_id: userId };

    // Add search condition if search query is provided
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { owner: { [Op.iLike]: `%${search}%` } },
        { full_name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Get total count for pagination
    const total = await this.repositoryModel.count({ where });

    // Get paginated results
    const items = await this.repositoryModel.findAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async addRepository(
    userId: number,
    dto: AddRepositoryDto,
  ): Promise<Repository> {
    try {
      // Check if repository already exists for this user
      const existingRepo = await this.repositoryModel.findOne({
        where: {
          full_name: dto.path,
          user_id: userId,
        },
      });

      if (existingRepo) {
        throw new HttpException(
          'Repository already exists',
          HttpStatus.CONFLICT,
        );
      }

      // Fetch repository data from GitHub API
      const repoData = await this.fetchRepositoryFromGitHub(dto.path);

      // Create repository in database
      const repository = await this.repositoryModel.create({
        owner: repoData.owner.login,
        name: repoData.name,
        full_name: repoData.full_name,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        open_issues: repoData.open_issues_count,
        created_at: Math.floor(new Date(repoData.created_at).getTime() / 1000),
        user_id: userId,
      });

      return repository;
    } catch (error: any) {
      this.logger.error(
        `Error adding repository: ${error.message}`,
        error.stack,
      );
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.response?.status === 404) {
        throw new HttpException(
          'Repository not found on GitHub',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Failed to add repository: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateRepository(
    userId: number,
    repositoryId: number,
  ): Promise<Repository> {
    try {
      const repository = await this.repositoryModel.findOne({
        where: {
          id: repositoryId,
          user_id: userId,
        },
      });

      if (!repository) {
        throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
      }

      // Fetch latest data from GitHub
      const repoData = await this.fetchRepositoryFromGitHub(
        repository.full_name,
      );

      // Update repository with new data
      repository.stars = repoData.stargazers_count;
      repository.forks = repoData.forks_count;
      repository.open_issues = repoData.open_issues_count;

      await repository.save();

      return repository;
    } catch (error: any) {
      this.logger.error(
        `Error updating repository: ${error.message}`,
        error.stack,
      );
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to update repository: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteRepository(userId: number, repositoryId: number): Promise<void> {
    const repository = await this.repositoryModel.findOne({
      where: {
        id: repositoryId,
        user_id: userId,
      },
    });

    if (!repository) {
      throw new HttpException('Repository not found', HttpStatus.NOT_FOUND);
    }

    await repository.destroy();
  }

  async searchGitHubRepositories(query: string): Promise<any[]> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.githubApiUrl}/search/repositories`, {
          params: {
            q: query,
            sort: 'stars',
            order: 'desc',
            per_page: 10,
          },
        }),
      );

      return response.data.items.map((item) => ({
        id: item.id,
        full_name: item.full_name,
        description: item.description,
        stargazers_count: item.stargazers_count,
        owner: {
          login: item.owner.login,
          avatar_url: item.owner.avatar_url,
        },
      }));
    } catch (error: any) {
      this.logger.error(
        `Error searching GitHub repositories: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to search GitHub repositories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async fetchRepositoryFromGitHub(
    repositoryPath: string,
  ): Promise<any> {
    try {
      const headers = {};

      const githubToken = this.configService.get('GITHUB_TOKEN');
      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }

      const response = await lastValueFrom(
        this.httpService.get(`${this.githubApiUrl}/repos/${repositoryPath}`, {
          headers,
        }),
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(
        `Error fetching repository from GitHub: ${error.message}`,
        error.stack,
      );

      if (error.response?.status === 404) {
        throw new HttpException(
          'Repository not found on GitHub',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Failed to fetch repository from GitHub: ' +
          (error.response?.data?.message ?? error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
