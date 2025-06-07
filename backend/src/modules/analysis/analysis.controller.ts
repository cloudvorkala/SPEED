import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AnalysisService } from './analysis.service';
import { AnalysisDataDto } from './dto/analysis.dto';

@Controller('analysis')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('articles')
  @Roles('analyst')
  async getArticlesForAnalysis(@Request() req) {
    return this.analysisService.getArticlesForAnalysis(req.user._id);
  }

  @Get('rejected')
  @Roles('admin', 'moderator')
  async getRejectedArticles() {
    return this.analysisService.getRejectedArticles();
  }

  @Post('articles/:id')
  @Roles('analyst')
  async analyzeArticle(
    @Param('id') id: string,
    @Request() req,
    @Body() analysisData: AnalysisDataDto,
  ) {
    console.log('Analyzing article:', { id, userId: req.user._id, analysisData });
    return this.analysisService.analyzeArticle(id, req.user._id, analysisData);
  }

  @Get('articles/:id')
  @Roles('admin', 'moderator', 'analyst')
  async getArticleAnalysis(@Param('id') id: string) {
    return this.analysisService.getArticleAnalysis(id);
  }

  @Get('stats')
  @Roles('analyst')
  async getAnalystStats(@Request() req) {
    return this.analysisService.getAnalystStats(req.user._id);
  }
}