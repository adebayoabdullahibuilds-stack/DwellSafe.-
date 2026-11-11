import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FinancialAuditService } from './financial-audit.service';
import { PaymentAccessService } from './payment-access.service';

@Module({
  imports: [AuthModule],
  providers: [FinancialAuditService, PaymentAccessService],
  exports: [FinancialAuditService, PaymentAccessService],
})
export class PaymentsFoundationModule {}
