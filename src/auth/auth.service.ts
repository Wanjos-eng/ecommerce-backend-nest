import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Método de login
  async login(loginDto: LoginDto): Promise<string> {
    const { email } = loginDto;
    const user = await this.userService.findByEmail(email);

    // Verificar se o usuário existe e se a senha está correta
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new Error('Invalid email or password');
    }

    // Gerar o token JWT
    const payload = { userId: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
