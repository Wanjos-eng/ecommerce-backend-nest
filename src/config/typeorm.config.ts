import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USER', 'user'),
  password: configService.get<string>('DATABASE_PASSWORD', 'password'),
  database: configService.get<string>('DATABASE_NAME', 'ecommerce'),
  autoLoadEntities: true,
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  logging: configService.get<string>('NODE_ENV') !== 'production',
  migrationsRun: configService.get<string>('NODE_ENV') === 'production',
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
});
