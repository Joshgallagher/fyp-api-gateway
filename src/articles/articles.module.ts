import { Module, HttpModule } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RatingsModule } from 'src/ratings/ratings.module';

@Module({
  imports: [HttpModule, ConfigModule, UserModule, RatingsModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService]
})
export class ArticlesModule { }
