import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { LoginDto } from '../auth/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Método para buscar um usuário pelo email
  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ email });
  }

  // Método de login
  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.findByEmail(email);

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Gerar o token JWT
    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return token;
  }

  // Método para criar um novo usuário
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  // Método para listar todos os usuários
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Método para buscar um usuário por ID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // Método para atualizar um usuário
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  // Método para deletar um usuário
  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'User deleted successfully' };
  }
}
