import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  // Método para validar login via OAuth (Google, GitHub)
  async validateOAuthLogin(userData: any): Promise<string> {
    const { provider, providerId, email, name } = userData;

    let user = await this.userService.findByProviderId(provider, providerId);

    if (!user) {
      user = await this.userService.createUser({
        name,
        email,
        provider,
        providerId,
        role: UserRole.CUSTOMER,
        password: null,
      });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  // Método de registro (cadastro) de usuário
  async register(createUserDto: CreateUserDto): Promise<string> {
    const { password } = createUserDto;

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário
    const user = await this.userService.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

    // Retornar apenas o ID do usuário
    return user.id;
  }
}
