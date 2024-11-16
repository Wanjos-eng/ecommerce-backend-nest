import { JwtModuleOptions } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'defaultSecretKey',
  signOptions: {
    expiresIn: '1h',
  },
};
