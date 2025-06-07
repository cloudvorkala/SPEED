import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Article, ArticleSchema } from './models/article.model';
import { User, UserSchema } from './models/user.model';
import { Practice, PracticeSchema } from './models/practice.model';
import { Claim, ClaimSchema } from './models/claim.model';
import { Evidence, EvidenceSchema } from './models/evidence.model';
import { Rating, RatingSchema } from './models/rating.model';
import { SavedQuery, SavedQuerySchema } from './models/saved-query.model';
import { ArticlesModule } from './modules/articles/articles.module';
import { PracticesModule } from './modules/practices/practices.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { EvidenceModule } from './modules/evidence/evidence.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { SeederService } from './database/seeder.service';
import { AnalysisModule } from './modules/analysis/analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.DATABASE_URI || 'mongodb://localhost:27017/speed',
    ),
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: User.name, schema: UserSchema },
      { name: Practice.name, schema: PracticeSchema },
      { name: Claim.name, schema: ClaimSchema },
      { name: Evidence.name, schema: EvidenceSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: SavedQuery.name, schema: SavedQuerySchema },
    ]),
    DatabaseModule,
    ArticlesModule,
    PracticesModule,
    ClaimsModule,
    EvidenceModule,
    UsersModule,
    AuthModule,
    AnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    await this.seederService.seed();
  }
}
