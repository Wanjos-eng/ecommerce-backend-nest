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
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint de registro de usuário
   * - Rota: POST /auth/register
   * - Recebe o corpo da requisição com os dados de registro (RegisterDto).
   * - Retorna mensagem de sucesso e o ID do usuário criado.
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const userId = await this.authService.register(registerDto);
      return {
        message: 'User registered successfully.',
        userId,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Endpoint de login
   * - Rota: POST /auth/login
   * - Recebe o corpo da requisição com email e senha (LoginDto).
   * - Retorna o token JWT se as credenciais forem válidas.
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Endpoint para autenticação via Google
   * - Rota: GET /auth/google
   * - Utiliza o guard de autenticação para redirecionar o usuário ao Google.
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  /**
   * Redirecionamento após autenticação via Google
   * - Rota: GET /auth/google/redirect
   * - Retorna o token JWT após login bem-sucedido.
   */
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return { accessToken: await this.authService.validateOAuthLogin(req.user) };
  }

  /**
   * Endpoint para autenticação via GitHub
   * - Rota: GET /auth/github
   * - Utiliza o guard de autenticação para redirecionar o usuário ao GitHub.
   */
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  /**
   * Redirecionamento após autenticação via GitHub
   * - Rota: GET /auth/github/redirect
   * - Retorna o token JWT após login bem-sucedido.
   */
  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req) {
    return { accessToken: await this.authService.validateOAuthLogin(req.user) };
  }
}
