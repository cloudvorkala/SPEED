import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../models/article.model';
import { User, UserDocument } from '../models/user.model';
import { Practice, PracticeDocument } from '../models/practice.model';
import { Claim, ClaimDocument } from '../models/claim.model';
import * as bcrypt from 'bcrypt';  

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Practice.name) private practiceModel: Model<PracticeDocument>,
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
  ) {}

  async seed() {
    // make sure the admin user exists
    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    await this.userModel.updateOne(
      { email: 'admin@example.com' },
      {
        $set: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: hashedPasswordAdmin,
          role: 'ADMIN',
        },
      },
      { upsert: true }
    );
    this.logger.log('Admin user ensured: admin@example.com / admin123');

    // check if the database is empty
    const articleCount = await this.articleModel.countDocuments();
    if (articleCount > 0) {
      this.logger.log('Database already has data, skipping article/practice/claim seeding');
      return;
    }

    this.logger.log('Database is empty, seeding initial data...');

    // create a default user
    const hashedPasswordUser = await bcrypt.hash('password123', 10);
    const user = await this.userModel.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPasswordUser,
      role: 'USER',
    });

    // create practices
    const practices = await this.practiceModel.create([
      { name: 'Test-Driven Development', description: 'A software development process...' },
      { name: 'Continuous Integration', description: 'The practice of merging...' },
    ]);

    // create articles
    const articles = await this.articleModel.create([
      {
        title: 'The Impact of Test-Driven Development on Software Quality',
        authors: ['John Doe', 'Jane Smith'],
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
    ]);

    // create claims
    await this.claimModel.create([
      { practice: practices[0]._id, description: 'TDD leads to higher code quality', evidence: [] },
    ]);

    this.logger.log('Database seeded successfully');
  }
}
