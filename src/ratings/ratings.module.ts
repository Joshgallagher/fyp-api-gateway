import { Module, HttpModule } from '@nestjs/common';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('RATING_SERVICE_URL')
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [HttpModule]
})
export class RatingsModule { }
