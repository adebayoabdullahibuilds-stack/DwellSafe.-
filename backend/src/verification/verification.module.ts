import { Module } from '@nestjs/common';
import { ListingsModule } from '../listings/listings.module';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';

@Module({
  imports: [ListingsModule],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
