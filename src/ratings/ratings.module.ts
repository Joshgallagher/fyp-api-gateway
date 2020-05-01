import { Module, HttpModule, HttpService } from '@nestjs/common';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService]
})
export class RatingsModule { }
