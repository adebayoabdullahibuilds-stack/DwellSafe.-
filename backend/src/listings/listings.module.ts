import { Module } from '@nestjs/common';
import { DemoListingsProvider } from './demo-listings.provider';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

@Module({
  controllers: [ListingsController],
  providers: [ListingsService, DemoListingsProvider],
  exports: [ListingsService, DemoListingsProvider],
})
export class ListingsModule {}
