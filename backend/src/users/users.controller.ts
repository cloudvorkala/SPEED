import { Controller, Get, Param, Delete, UseGuards, Req, ForbiddenException, NotFoundException, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../modules/auth/guards/roles.guard';
import { Roles } from '../modules/auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  async findAll(@Req() req): Promise<User[]> {
    console.log('Fetching all users, user:', req.user);
    const users = await this.usersService.findAll();
    console.log('Found users:', users.length);
    return users;
  }

  @Get(':id')
  @Roles('ADMIN')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const result = await this.usersService.delete(id);
    if (!result) throw new NotFoundException('User not found');
    return { deleted: true };
  }

  @Put(':id/moderator')
  @Roles('ADMIN')
  async toggleModerator(
    @Param('id') id: string,
    @Body('isModerator') isModerator: boolean
  ): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.usersService.update(id, { isModerator });
    return updatedUser;
  }
}
