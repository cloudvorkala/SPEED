import { Controller, Get, Param, Delete, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // JwtAuthGuard

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private isAdmin(req: any): boolean {
    console.log('Checking admin role:', req.user);
    return req.user && req.user.role === 'ADMIN';
  }

  @Get()
  async findAll(@Req() req): Promise<User[]> {
    console.log('Fetching all users, user:', req.user);
    if (!this.isAdmin(req)) {
      console.log('Access denied: Not an admin');
      throw new ForbiddenException('Access denied: Admins only');
    }
    const users = await this.usersService.findAll();
    console.log('Found users:', users.length);
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req): Promise<User> {
    if (!this.isAdmin(req)) {
      throw new ForbiddenException('Access denied: Admins only');
    }
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req): Promise<{ deleted: boolean }> {
    if (!this.isAdmin(req)) {
      throw new ForbiddenException('Access denied: Admins only');
    }
    const result = await this.usersService.delete(id);
    if (!result) throw new NotFoundException('User not found');
    return { deleted: true };
  }
}
