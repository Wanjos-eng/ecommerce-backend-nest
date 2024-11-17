import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserRole } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Buscar usuário pelo email
  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOneBy({ email });
  }

  // Buscar usuário por provedor e ID do provedor
  async findByProviderId(
    provider: string,
    providerId: string,
  ): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { provider, providerId },
    });
  }

  // Criar novo usuário (tradicional ou OAuth)
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, provider, providerId, role } = createUserDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new HttpException('Email já está em uso', HttpStatus.CONFLICT);
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      provider: provider || null,
      providerId: providerId || null,
      role: role || UserRole.CUSTOMER,
    });

    return await this.userRepository.save(user);
  }

  // Buscar usuário por ID
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  // Atualizar usuário
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  // Deletar usuário
  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'User deleted successfully' };
  }
}
