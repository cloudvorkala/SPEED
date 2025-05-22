import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../models/article.model';
import { User, UserDocument } from '../models/user.model';
import { Practice, PracticeDocument } from '../models/practice.model';
import { Claim, ClaimDocument } from '../models/claim.model';

@Injectable()
export class SeederService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Practice.name) private practiceModel: Model<PracticeDocument>,
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
  ) {}

  async seed() {
    // check if there is data in the database
    const articleCount = await this.articleModel.countDocuments();
    if (articleCount > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    console.log('Database is empty, seeding initial data...');

    // create a user
    const user = await this.userModel.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    //
    const practices = await this.practiceModel.create([
      {
        name: 'Test-Driven Development',
        description:
          'A software development process that relies on the repetition of a very short development cycle.',
      },
      {
        name: 'Continuous Integration',
        description:
          'The practice of merging all developers working copies to a shared mainline several times a day.',
      },
    ]);

    //
    const articles = await this.articleModel.create([
      {
        title: 'The Impact of Test-Driven Development on Software Quality',
        authors: ['John Doe', 'Jane Smith', 'Robert Johnson'],
        journal: 'Journal of Software Engineering',
        year: 2023,
        doi: '10.1234/jse.2023.001',
        status: 'APPROVED',
        averageRating: 4.5,
        ratingCount: 10,
        submitter: user._id,
        moderator: user._id,
        moderationDate: new Date(),
      },
      {
        title: 'Continuous Integration in Modern Software Development',
        authors: ['Alice Brown', 'Charlie Davis'],
        journal: 'Software Engineering Today',
        year: 2023,
        doi: '10.1234/set.2023.002',
        status: 'APPROVED',
        averageRating: 4.2,
        ratingCount: 8,
        submitter: user._id,
        moderator: user._id,
        moderationDate: new Date(),
      },
      {
        title: 'Agile Practices and Their Impact on Project Success',
        authors: ['Emma Wilson', 'Frank Miller'],
        journal: 'Agile Development Review',
        year: 2023,
        doi: '10.1234/adr.2023.003',
        status: 'PENDING',
        submitter: user._id,
      },
    ]);

    // create claims
    await this.claimModel.create([
      {
        practice: practices[0]._id,
        description: 'TDD leads to higher code quality',
        evidence: [],
      },
      {
        practice: practices[1]._id,
        description: 'CI reduces integration problems',
        evidence: [],
      },
    ]);

    console.log('Database seeded successfully');
  }
}
