import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from '../../models/article.model';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('author') author?: string,
    @Query('title') title?: string,
    @Query('journal') journal?: string,
    @Query('year') year?: string,
  ): Promise<Article[]> {
    return this.articlesService.findAll({ status, author, title, journal, year });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article> {
    return this.articlesService.findOne(id);
  }

  @Post()
  async create(@Body() article: Partial<Article>): Promise<Article> {
    return this.articlesService.create(article);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() article: Partial<Article>,
  ): Promise<Article> {
    return this.articlesService.update(id, article);
  }

  @Put(':id/moderate')
  async moderate(
    @Param('id') id: string,
    @Body()
    moderationData: {
      status: 'APPROVED' | 'REJECTED';
      moderatorId: string;
      rejectionReason?: string;
    },
  ): Promise<Article> {
    return this.articlesService.moderate(
      id,
      moderationData.status,
      moderationData.moderatorId,
      moderationData.rejectionReason,
    );
  }

  @Put(':id/rate')
  async rate(
    @Param('id') id: string,
    @Body() ratingData: { rating: number },
  ): Promise<Article> {
    return this.articlesService.updateRating(id, ratingData.rating);
  }
}
