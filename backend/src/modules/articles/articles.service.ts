import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../models/article.model';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) throw new Error(`Article with id ${id} not found`);
    return article;
  }

  async findPending(): Promise<Article[]> {
    return this.articleModel.find({ status: 'PENDING' }).exec();
  }

  async findApproved(): Promise<Article[]> {
    return this.articleModel.find({ status: 'APPROVED' }).exec();
  }

  async create(article: Partial<Article>): Promise<Article> {
    const newArticle = new this.articleModel(article);
    return newArticle.save();
  }

  async update(id: string, article: Partial<Article>): Promise<Article> {
    const updated = await this.articleModel
      .findByIdAndUpdate(id, article, { new: true })
      .exec();
    if (!updated) throw new Error(`Article with id ${id} not found`);
    return updated;
  }

  async moderate(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    moderatorId: string,
    rejectionReason?: string,
  ): Promise<Article> {
    const moderated = await this.articleModel
      .findByIdAndUpdate(
        id,
        {
          status,
          moderator: moderatorId,
          moderationDate: new Date(),
          rejectionReason: status === 'REJECTED' ? rejectionReason : undefined,
        },
        { new: true },
      )
      .exec();
    if (!moderated) throw new Error(`Article with id ${id} not found`);
    return moderated;
  }

  async updateRating(id: string, rating: number): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();

    if (!article) {
      throw new Error(`Article with id ${id} not found`);
    }

    const newRatingCount = article.ratingCount + 1;
    const newAverageRating =
      (article.averageRating * article.ratingCount + rating) / newRatingCount;

    const updated = await this.articleModel
      .findByIdAndUpdate(
        id,
        {
          averageRating: newAverageRating,
          ratingCount: newRatingCount,
        },
        { new: true },
      )
      .exec();

    if (!updated) throw new Error(`Article with id ${id} not found`);
    return updated;
  }
}
