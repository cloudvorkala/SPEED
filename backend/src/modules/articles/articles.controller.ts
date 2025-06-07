import { Body, Controller, Get, Param, Post, Put, Query, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from '../../models/article.model';
import { Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Get()
  async findAll(@Query() query: {
    author?: string;
    title?: string;
    journal?: string;
    year?: string;
    status?: string;
  }): Promise<Article[]> {
    console.log('Controller received query:', query);
    return this.articlesService.findAll(query);
  }

  @Get('admin/all')
  @Roles('ADMIN')
  async findAllForAdmin(@Request() req): Promise<Article[]> {
    if (!req.user.isAdmin) {
      throw new NotFoundException('Access denied');
    }
    return this.articlesService.findAllForAdmin();
  }

  @Get('pending')
  @Roles('MODERATOR')
  async findPending(@Request() req): Promise<Article[]> {
    if (!req.user.isModerator) {
      throw new NotFoundException('Access denied');
    }
    return this.articlesService.findPending();
  }

  @Get('pending/count')
  @Roles('MODERATOR')
  async getPendingCount(@Request() req): Promise<{ count: number }> {
    if (!req.user.isModerator) {
      throw new NotFoundException('Access denied');
    }
    const count = await this.articlesService.getPendingCount();
    return { count };
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

  @Put(':id/status')
  @Roles('ADMIN')
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() data: { status: 'APPROVED' | 'REJECTED' },
  ): Promise<Article> {
    if (!req.user.isAdmin) {
      throw new NotFoundException('Access denied');
    }
    const updated = await this.articlesService.updateStatus(id, data.status);
    if (!updated) throw new NotFoundException('Article not found');
    return updated;
  }

  @Post(':id/moderate')
  @Roles('MODERATOR')
  async moderate(
    @Request() req,
    @Param('id') id: string,
    @Body() moderationData: {
      status: 'APPROVED' | 'REJECTED';
      isPeerReviewed: boolean;
      isRelevantToSE: boolean;
      isDuplicateChecked: boolean;
      duplicateCheckResult?: string;
      rejectionReason?: string;
    },
  ): Promise<Article | null> {
    if (!req.user.isModerator) {
      throw new NotFoundException('Access denied');
    }
    return this.articlesService.moderate(
      id,
      moderationData.status,
      req.user._id,
      moderationData,
    );
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
  @Roles('ADMIN')
  async delete(@Request() req, @Param('id') id: string): Promise<{ deleted: boolean }> {
    if (!req.user.isAdmin) {
      throw new NotFoundException('Access denied');
    }
    const deleted = await this.articlesService.delete(id);
    if (!deleted) throw new NotFoundException('Article not found');
    return { deleted: true };
  }

  @Put(':id/update')
  @Roles('MODERATOR')
  async updateArticle(
    @Request() req,
    @Param('id') id: string,
    @Body() updateData: {
      isPeerReviewed?: boolean;
      isRelevantToSE?: boolean;
      isDuplicateChecked?: boolean;
    },
  ): Promise<Article> {
    if (!req.user.isModerator) {
      throw new NotFoundException('Access denied');
    }
    const updated = await this.articlesService.update(id, updateData);
    if (!updated) throw new NotFoundException('Article not found');
    return updated;
  }
}
