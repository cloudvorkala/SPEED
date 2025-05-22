import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from '../models/article.model';
import { User, UserSchema } from '../models/user.model';
import { Practice, PracticeSchema } from '../models/practice.model';
import { Claim, ClaimSchema } from '../models/claim.model';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: User.name, schema: UserSchema },
      { name: Practice.name, schema: PracticeSchema },
      { name: Claim.name, schema: ClaimSchema },
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class DatabaseModule {}