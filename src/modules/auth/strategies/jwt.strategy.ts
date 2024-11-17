import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
    });
  }

  async validate(payload: any) {
    // Acessar o ID do usuário usando o campo `sub` do payload
    const user = await this.userService.findOne(payload.sub);

    // Verificar se o usuário existe
    if (!user) {
      throw new UnauthorizedException('User no longer exists or is invalid');
    }

    // Retornar apenas os dados necessários
    return { id: user.id, email: user.email, role: user.role };
  }
}
