import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles('ADMIN')
  getDashboard() {
    return { message: 'Welcome to the Admin Dashboard' };
  }

  @Get('settings')
  @Roles('ADMIN')
  getSettings() {
    return { message: 'Admin Settings Page' };
  }
}
