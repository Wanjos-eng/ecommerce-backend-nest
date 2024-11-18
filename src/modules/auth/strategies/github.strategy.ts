import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/github/redirect`,
      scope: ['user:email'],
    });
  }

  /**
   * Método de validação do usuário autenticado
   * - Extrai informações do usuário retornadas pelo GitHub.
   * - Retorna os dados necessários para criação ou login do usuário.
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ): Promise<void> {
    const { id, username, emails } = profile;
    const user = {
      provider: 'github',
      providerId: id,
      email: emails[0].value,
      name: username,
    };

    done(null, user);
  }
}
