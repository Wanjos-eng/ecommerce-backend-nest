import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Método de registro de usuário:
   * - Recebe o DTO de registro (`RegisterDto`).
   * - Verifica se o email já está em uso.
   * - Faz o hash da senha e cria o usuário.
   * - Retorna o ID do usuário criado.
   */
  async register(registerDto: RegisterDto): Promise<string> {
    const { email, password } = registerDto;

    // Verificar se o email já está em uso
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use.');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário
    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    return user.id;
  }

  /**
   * Método de login:
   * - Recebe o DTO de login (`LoginDto`).
   * - Busca o usuário pelo email.
   * - Compara a senha informada com o hash armazenado.
   * - Lança exceção se as credenciais forem inválidas.
   * - Gera um token JWT e retorna.
   */
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // Buscar o usuário pelo email
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Criar o payload para o token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };

    // Retornar o token JWT
    return { accessToken: this.jwtService.sign(payload) };
  }

  /**
   * Método para validar login via OAuth (Google, GitHub)
   * - Verifica se o usuário já existe com base no `providerId`.
   * - Se o usuário não existir, cria um novo.
   * - Gera um token JWT para o usuário autenticado.
   */
  async validateOAuthLogin(userData: any): Promise<string> {
    const { provider, providerId, email, name } = userData;

    // Verificar se o usuário já existe com base no providerId
    let user = await this.userService.findByProviderId(provider, providerId);

    // Se o usuário não existir, criar um novo
    if (!user) {
      user = await this.userService.createUser({
        name,
        email,
        provider,
        providerId,
        password: null, // Usuário OAuth não tem senha
      });
    }

    // Criar o payload para o token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
