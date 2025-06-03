import { Body, Controller, Get, Param, Post, Put, Query, NotFoundException } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from '../../models/article.model';
import { Delete } from '@nestjs/common';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Get()
  async findAll(
    @Query('author') author?: string,
  ): Promise<Article[]> {
    // only uploaded articles are returned
    return this.articlesService.findAll({ author });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article> {
    const article = await this.articlesService.findOne(id);
    if (!article) throw new NotFoundException('Article not found');
    return article;
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
    const updated = await this.articlesService.update(id, article);
    if (!updated) throw new NotFoundException('Article not found');
    return updated;
  }

  @Put(':id/moderate')
  async moderate(
    @Param('id') id: string,
    @Body()
    moderationData: {
      status: 'APPROVED' | 'REJECTED';
      moderatorId: string;
    },
  ): Promise<Article> {
    const moderated = await this.articlesService.moderate(
      id,
      moderationData.status,
      moderationData.moderatorId,
    );
    if (!moderated) throw new NotFoundException('Article not found');
    return moderated;
  }

  @Put(':id/rate')
  async rate(
    @Param('id') id: string,
    @Body() ratingData: { rating: number },
  ): Promise<Article> {
    const rated = await this.articlesService.updateRating(id, ratingData.rating);
    if (!rated) throw new NotFoundException('Article not found');
    return rated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.articlesService.delete(id);
    if (!deleted) throw new NotFoundException('Article not found');
    return { deleted: true };
  }
}
