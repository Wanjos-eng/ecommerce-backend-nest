import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const userId = await this.authService.register(createUserDto);
      return {
        message: 'Usuário registrado com sucesso.',
        userId,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return { accessToken: await this.authService.validateOAuthLogin(req.user) };
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req) {
    return { accessToken: await this.authService.validateOAuthLogin(req.user) };
  }
}
