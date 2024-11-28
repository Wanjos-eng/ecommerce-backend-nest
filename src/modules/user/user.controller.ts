import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Rota para obter perfil do usuário
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    const { userId } = req.user;
    return this.userService.getProfile(userId);
  }

  //Rota para atualizar perfil do usuário
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.sub; //Obter o ID do usuário do token JWT
    return this.userService.updateProfile(userId, updateUserDto);
  }

  //Rota para excluir perfil do usuário
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.deleteUser(id);
    return { message: `User with Id ${id} has been successfully deleted` };
  }
}
