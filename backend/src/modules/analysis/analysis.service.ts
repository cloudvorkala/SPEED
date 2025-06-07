import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Article } from '../../models/article.model';
import { User } from '../../models/user.model';
import { AnalysisDataDto } from './dto/analysis.dto';
import { ArticleStatus } from '../articles/dto/create-article.dto';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getArticlesForAnalysis(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.isAnalyst) {
      throw new ForbiddenException('Only analysts can access this endpoint');
    }

    return this.articleModel.find({
      status: ArticleStatus.READY_FOR_ANALYSIS,
      analyzedBy: { $ne: new Types.ObjectId(userId) }
    }).sort({ createdAt: -1 });
  }

  async getRejectedArticles() {
    return this.articleModel.find({
      status: 'REJECTED'
    }).sort({ createdAt: -1 });
  }

  async analyzeArticle(articleId: string, userId: string, analysisData: AnalysisDataDto) {
    const user = await this.userModel.findById(userId).select('+isAnalyst');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isAnalyst) {
      throw new ForbiddenException('Only analysts can analyze articles');
    }

    const article = await this.articleModel.findById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.status !== ArticleStatus.READY_FOR_ANALYSIS) {
      throw new ForbiddenException('Article is not ready for analysis');
    }

    const analysisResult = {
      researchType: analysisData.researchType,
      participantType: analysisData.participantType,
      methodology: analysisData.methodology,
      findings: analysisData.findings,
      limitations: analysisData.limitations || '',
      recommendations: analysisData.recommendations || '',
      notes: analysisData.notes || ''
    };

    article.analyzedBy = new Types.ObjectId(userId);
    article.analyzedAt = new Date();
    article.analysisResult = analysisResult;
    article.status = ArticleStatus.ANALYZED;

    return article.save();
  }

  async getArticleAnalysis(articleId: string) {
    const article = await this.articleModel.findById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (!article.analysisResult) {
      throw new NotFoundException('Article has not been analyzed yet');
    }

    return article.analysisResult;
  }

  async getAnalystStats(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.isAnalyst) {
      throw new ForbiddenException('Only analysts can access this endpoint');
    }

    const totalAnalyzed = await this.articleModel.countDocuments({
      analyzedBy: new Types.ObjectId(userId)
    });

    const recentAnalysis = await this.articleModel.find({
      analyzedBy: new Types.ObjectId(userId)
    })
    .sort({ analyzedAt: -1 })
    .limit(5)
    .select('title analyzedAt');

    return {
      totalAnalyzed,
      recentAnalysis
    };
  }
}