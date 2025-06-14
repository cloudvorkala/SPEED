import { Body, Controller, Get, Param, Post, Put, Query, NotFoundException, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Article } from '../../models/article.model';
import { Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.articlesService.findAll(query);
  }

  @Get('analyzed')
  async getAnalyzedArticles() {
    try {
      const articles = await this.articlesService.findAnalyzed();
      return articles;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch analyzed articles',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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
  async findOne(@Param('id') id: string) {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  @Get('admin/all')
  @Roles('ADMIN')
  async findAllForAdmin(@Request() req): Promise<Article[]> {
    if (!req.user.isAdmin) {
      throw new NotFoundException('Access denied');
    }
    return this.articlesService.findAllForAdmin();
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
