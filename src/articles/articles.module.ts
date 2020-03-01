import { Module, HttpModule } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('ARTICLE_SERVICE_URL')
      }),
      inject: [ConfigService],
    }),
    UserModule
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService, HttpModule]
})
export class ArticlesModule { }
