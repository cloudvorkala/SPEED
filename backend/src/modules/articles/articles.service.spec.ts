import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Query, Document, Types } from 'mongoose';
import { ArticlesService } from './articles.service';
import { Article } from '../../models/article.model';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let model: Model<Article>;

  const mockArticle = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    title: 'Test Article',
    abstract: 'Test Abstract',
    authors: ['John Doe'],
    journal: 'Test Journal',
    year: 2024,
    status: 'PENDING',
    rating: 0,
    ratingCount: 0,
    save: jest.fn(),
  } as unknown as Document<unknown, {}, Article> &
    Article & { _id: Types.ObjectId } & { __v: number };

  const mockModel = {
    new: jest.fn().mockResolvedValue(mockArticle),
    constructor: jest.fn().mockResolvedValue(mockArticle),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getModelToken(Article.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    model = module.get<Model<Article>>(getModelToken(Article.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const articles = [mockArticle];
      const mockQuery = {
        exec: jest.fn().mockResolvedValueOnce(articles),
      } as unknown as Query<Article[], Article>;

      jest.spyOn(model, 'find').mockReturnValue(mockQuery);

      const result = await service.findAll();
      expect(result).toEqual(articles);
    });

    it('should filter articles by author', async () => {
      const articles = [mockArticle];
      const mockQuery = {
        exec: jest.fn().mockResolvedValueOnce(articles),
      } as unknown as Query<Article[], Article>;

      const findSpy = jest.spyOn(model, 'find').mockReturnValue(mockQuery);

      const result = await service.findAll({ author: 'John Doe' });
      expect(findSpy).toHaveBeenCalledWith({
        authors: { $regex: 'John Doe', $options: 'i' },
      });
      expect(result).toEqual(articles);
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValueOnce(mockArticle),
      } as unknown as Query<Article, Article>;

      jest.spyOn(model, 'findById').mockReturnValue(mockQuery);

      const result = await service.findOne('1');
      expect(result).toEqual(mockArticle);
    });
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const newArticle = {
        title: 'New Article',
        abstract: 'New Abstract',
        authors: ['Jane Doe'],
        journal: 'New Journal',
        year: 2024,
      };

      jest.spyOn(model, 'create').mockResolvedValueOnce(mockArticle as any);

      const result = await service.create(newArticle);
      expect(result).toEqual(mockArticle);
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const updateData = {
        title: 'Updated Article',
      };

      const mockQuery = {
        exec: jest
          .fn()
          .mockResolvedValueOnce({ ...mockArticle, ...updateData }),
      } as unknown as Query<Article, Article>;

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue(mockQuery);

      const result = await service.update('1', updateData);
      expect(result).toEqual({ ...mockArticle, ...updateData });
    });
  });

  describe('moderate', () => {
    it('should moderate an article', async () => {
      const moderationData = {
        status: 'APPROVED' as const,
        moderatorId: 'mod1',
      };

      const mockQuery = {
        exec: jest
          .fn()
          .mockResolvedValueOnce({ ...mockArticle, ...moderationData }),
      } as unknown as Query<Article, Article>;

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue(mockQuery);

      const result = await service.moderate('1', 'APPROVED', 'mod1');
      expect(result).toEqual({ ...mockArticle, ...moderationData });
    });
  });

  describe('updateRating', () => {
    it('should update article rating', async () => {
      const rating = 4;
      const mockArticleWithRating = {
        ...mockArticle,
        rating: 0,
        ratingCount: 0,
      };

      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockArticleWithRating),
      } as any);

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({ ...mockArticleWithRating, rating }),
      } as any);

      const result = await service.updateRating('1', rating);
      expect(result).toEqual({ ...mockArticleWithRating, rating });
    });
  });
});
