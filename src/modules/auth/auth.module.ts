import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User]), // Importando o repositório diretamente
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, GoogleStrategy, GitHubStrategy],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
