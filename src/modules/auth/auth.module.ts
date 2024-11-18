import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule, // Importando o UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, GoogleStrategy, GitHubStrategy],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
