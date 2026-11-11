import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSessionGuard } from './auth-session.guard';
import { RolesGuard } from './roles.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthSessionGuard, RolesGuard],
  exports: [AuthSessionGuard, RolesGuard],
})
export class AuthModule {}
