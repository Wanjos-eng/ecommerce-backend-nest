import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  /**
   * Método de validação do usuário autenticado
   * - Extrai informações do usuário retornadas pelo Google.
   * - Retorna os dados necessários para criação ou login do usuário.
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, displayName, emails } = profile;
    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: displayName,
    };

    done(null, user);
  }
}
