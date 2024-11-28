import { ConfigModule } from '@nestjs/config';

export const DotenvConfig = ConfigModule.forRoot({
  isGlobal: true, // Disponível em toda a aplicação
  envFilePath: ['.env'], // Carrega o arquivo .env da raiz do projeto
});
