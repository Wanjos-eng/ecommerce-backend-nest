import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  /*
  Obter o perfil do usuário pelo ID
  */
  async getProfile(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    //Retornar apenas os dados públicos do perfil
    const { id, name, email, role } = user;
    return { id, name, email, role };
  }

  //Editar o perfil do usuário
  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    //Atualizar os dados do usuário
    Object.assign(user, updateUserDto);

    try {
      return await this.userRepository.save(user);
    } catch {
      throw new BadRequestException('Failed to update user profile.');
    }
  }

  //Excluir o perfil do usuário
  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    try {
      await this.userRepository.remove(user);
    } catch {
      throw new BadRequestException('Failed to delete user.');
    }
  }
}
