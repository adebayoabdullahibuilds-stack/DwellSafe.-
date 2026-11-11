import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './config/environment.validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { ListingsModule } from './listings/listings.module';
import { VerificationModule } from './verification/verification.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsFoundationModule } from './payments/payments-foundation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
      validate: validateEnvironment,
    }),
    DatabaseModule,
    HealthModule,
    ListingsModule,
    VerificationModule,
    AuthModule,
    PaymentsFoundationModule,
  ],
})
export class AppModule {}
