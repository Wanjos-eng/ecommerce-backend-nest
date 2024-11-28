import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Método de registro de usuário.
   */
  async register(registerDto: RegisterDto): Promise<string> {
    const { email, password, name, role } = registerDto;

    // Verificar se o email já está em uso
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email is already in use.');
    }

    // Gerar o hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Usar o enum UserRole para definir o role
    const userRole: UserRole = role
      ? (role.toLowerCase() as UserRole)
      : UserRole.CUSTOMER;

    // Criar o novo usuário
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // Salvar o usuário no banco de dados
    const savedUser = await this.userRepository.save(newUser);

    // Retornar o ID do usuário criado
    return savedUser.id;
  }

  /**
   * Método de login.
   */
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // Buscar o usuário pelo email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Comparar a senha usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Criar o payload para o token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  /**
   * Método para validar login via OAuth.
   */
  async validateOAuthLogin(userData: any): Promise<string> {
    const { provider, providerId, email, name } = userData;

    // Buscar o usuário pelo providerId
    let user = await this.userRepository.findOne({
      where: {
        provider,
        providerId,
      },
    });

    // Criar um novo usuário se não existir
    if (!user) {
      user = this.userRepository.create({
        name,
        email,
        provider,
        providerId,
        password: null,
        role: UserRole.CUSTOMER, // Usar o enum UserRole
      });

      user = await this.userRepository.save(user);
    }

    // Criar o payload para o token JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
