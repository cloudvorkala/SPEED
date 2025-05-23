import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from '../../models/article.model';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async findAll(filters?: { author?: string }): Promise<Article[]> {
    const query = filters?.author
      ? { authors: { $regex: filters.author, $options: 'i' } }
      : {};
    return this.articleModel.find(query).exec();
  }

  async findOne(id: string): Promise<Article | null> {
    return this.articleModel.findById(id).exec();
  }

  async findPending(): Promise<Article[]> {
    return this.articleModel.find({ status: 'PENDING' }).exec();
  }

  async findApproved(): Promise<Article[]> {
    return this.articleModel.find({ status: 'APPROVED' }).exec();
  }

  async create(article: Partial<Article>): Promise<Article> {
    return this.articleModel.create(article);
  }

  async update(id: string, article: Partial<Article>): Promise<Article | null> {
    return this.articleModel
      .findByIdAndUpdate(id, article, { new: true })
      .exec();
  }

  async moderate(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    moderatorId: string,
  ): Promise<Article | null> {
    return this.articleModel
      .findByIdAndUpdate(id, { status, moderatorId }, { new: true })
      .exec();
  }

  async updateRating(id: string, rating: number): Promise<Article | null> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new Error(`Article with id ${id} not found`);
    }
    const ratingCount = (article as any).ratingCount ?? 0;
    const currentRating = (article as any).rating ?? 0;
    const newRatingCount = ratingCount + 1;
    const newRating = (currentRating * ratingCount + rating) / newRatingCount;
    return this.articleModel
      .findByIdAndUpdate(
        id,
        { rating: newRating, ratingCount: newRatingCount },
        { new: true },
      )
      .exec();
  }
}
