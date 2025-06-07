import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../models/article.model';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async findAll(query: {
    author?: string;
    title?: string;
    journal?: string;
    year?: string;
    status?: string;
  } = {}): Promise<Article[]> {
    console.log('Received query:', query); // Log input parameters
    const filter: any = {};

    if (query.author) {
      filter.authors = { $regex: query.author, $options: 'i' };
    }
    if (query.title) {
      // Escape special characters in the search term
      const escapedTitle = query.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.title = { $regex: new RegExp(escapedTitle, 'i') };
    }
    if (query.journal) {
      filter.journal = { $regex: query.journal, $options: 'i' };
    }
    if (query.year) {
      filter.year = parseInt(query.year);
    }
    if (query.status) {
      filter.status = query.status;
    }

    console.log('MongoDB filter:', JSON.stringify(filter, null, 2));
    const results = await this.articleModel.find(filter).exec();
    console.log('Search results count:', results.length);
    console.log('First result:', results.length > 0 ? JSON.stringify(results[0], null, 2) : 'No results');
    return results;
  }

  async findAllForAdmin(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findPending(): Promise<Article[]> {
    const pendingArticles = await this.articleModel.find({ status: 'PENDING' }).exec();

    // Check for duplicates and previous rejections
    const articlesWithChecks = await Promise.all(
      pendingArticles.map(async (article) => {
        const duplicateCheck = await this.checkForDuplicates(article);
        const rejectionCheck = await this.checkForPreviousRejections(article);

        const articleObj = article.toObject();
        return {
          ...articleObj,
          duplicateCheckResult: duplicateCheck || undefined,
          rejectionCheckResult: rejectionCheck || undefined,
        } as Article;
      })
    );

    return articlesWithChecks;
  }

  private async checkForDuplicates(article: ArticleDocument): Promise<string | null> {
    // Check by DOI
    if (article.doi) {
      const existingByDOI = await this.articleModel.findOne({
        doi: article.doi,
        _id: { $ne: article._id },
      }).exec();

      if (existingByDOI) {
        return `Duplicate found by DOI: ${existingByDOI.title} (${existingByDOI.status})`;
      }
    }

    // Check by title (case insensitive)
    const existingByTitle = await this.articleModel.findOne({
      title: { $regex: new RegExp(`^${article.title}$`, 'i') },
      _id: { $ne: article._id },
    }).exec();

    if (existingByTitle) {
      return `Duplicate found by title: ${existingByTitle.title} (${existingByTitle.status})`;
    }

    return null;
  }

  private async checkForPreviousRejections(article: ArticleDocument): Promise<string | null> {
    // Check if this article was previously rejected
    const previousRejection = await this.articleModel.findOne({
      $or: [
        { doi: article.doi },
        { title: { $regex: new RegExp(`^${article.title}$`, 'i') } }
      ],
      status: 'REJECTED',
      _id: { $ne: article._id },
    }).exec();

    if (previousRejection) {
      return `Previously rejected: ${previousRejection.rejectionReason || 'No reason provided'}`;
    }

    return null;
  }

  async getPendingCount(): Promise<number> {
    return this.articleModel.countDocuments({ status: 'PENDING' }).exec();
  }

  async findOne(id: string): Promise<Article | null> {
    return this.articleModel.findById(id).exec();
  }

  async create(article: Partial<Article>): Promise<Article> {
    const newArticle = new this.articleModel({
      ...article,
      status: 'PENDING',
    });
    return newArticle.save();
  }

  async update(id: string, article: Partial<Article>): Promise<Article | null> {
    return this.articleModel
      .findByIdAndUpdate(id, article, { new: true })
      .exec();
  }

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<Article | null> {
    return this.articleModel
      .findByIdAndUpdate(
        id,
        {
          status,
          updatedAt: new Date()
        },
        { new: true }
      )
      .exec();
  }

  async moderate(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    moderatorId: string,
    moderationData: {
      isPeerReviewed: boolean;
      isRelevantToSE: boolean;
      isDuplicateChecked: boolean;
      duplicateCheckResult?: string;
      rejectionReason?: string;
    },
  ): Promise<Article | null> {
    const updateData = {
      $set: {
        moderatedBy: moderatorId,
        moderatedAt: new Date(),
        ...moderationData,
      }
    };

    // If approved, set status to READY_FOR_ANALYSIS
    if (status === 'APPROVED') {
      updateData.$set['status'] = 'READY_FOR_ANALYSIS';
    } else {
      updateData.$set['status'] = status;
    }

    console.log('Updating article with data:', updateData);

    return this.articleModel
      .findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      )
      .exec();
  }

  async updateRating(id: string, rating: number): Promise<Article | null> {
    return this.articleModel
      .findByIdAndUpdate(
        id,
        { rating },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.articleModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findAnalyzed() {
    try {
      const articles = await this.articleModel.find({
        status: 'ANALYZED',
        analysisResult: { $exists: true }
      }).sort({ analyzedAt: -1 }).exec();

      if (!articles) {
        return [];
      }

      return articles;
    } catch (error) {
      throw new Error('查询已分析文章失败');
    }
  }
}
