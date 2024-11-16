import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto, UserRole } from '../user/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Método de login tradicional (email e senha)
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);

    // Verificar se o usuário existe e se a senha está correta
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Gerar o token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  // Método para validar login via OAuth (Google, GitHub)
  async validateOAuthLogin(userData: any): Promise<string> {
    const { provider, providerId, email, name } = userData;

    // Verificar se o usuário já existe
    let user = await this.userService.findByProviderId(provider, providerId);

    if (!user) {
      // Se o usuário não existe, criar um novo
      user = await this.userService.createUser({
        name,
        email,
        provider,
        providerId,
        role: UserRole.CUSTOMER, // Correção aqui
      });
    }

    // Gerar o token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  // Método de registro (cadastro) de usuário
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const { email, password, name } = createUserDto;

    // Verificar se o email já está em uso
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const user = await this.userService.createUser({
      name,
      email,
      password: hashedPassword,
      role: UserRole.CUSTOMER, // Correção aqui
    });

    // Gerar o token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
