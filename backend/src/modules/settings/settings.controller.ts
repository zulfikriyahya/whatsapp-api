import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UpdateGlobalSettingsDto } from './dto/update-global-settings.dto';
import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class MaintenanceModeDto {
  @ApiProperty() @IsBoolean() enabled: boolean;
}

class AnnouncementDto {
  @ApiProperty() @IsString() @IsNotEmpty() message: string;
}

@ApiTags('Settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'settings', version: '1' })
export class SettingsController {
  constructor(private svc: SettingsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Dapatkan pengaturan user' })
  async getMySettings(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.getUserSettings(u.id) };
  }

  @Post('me')
  @ApiOperation({ summary: 'Update pengaturan user' })
  async updateMySettings(
    @CurrentUser() u: any,
    @Body() dto: UpdateSettingsDto,
  ) {
    return { status: true, data: await this.svc.updateUserSettings(u.id, dto) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('global')
  @ApiOperation({ summary: '[Admin] Dapatkan pengaturan global' })
  async getGlobal() {
    return { status: true, data: await this.svc.getGlobalSettings() };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('global')
  @ApiOperation({ summary: '[Admin] Update pengaturan global' })
  async updateGlobal(@Body() dto: UpdateGlobalSettingsDto) {
    return { status: true, data: await this.svc.updateGlobalSettings(dto) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('maintenance')
  @ApiOperation({ summary: '[Admin] Aktifkan / nonaktifkan maintenance mode' })
  async setMaintenance(@Body() dto: MaintenanceModeDto) {
    return {
      status: true,
      data: await this.svc.setMaintenanceMode(dto.enabled),
    };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('announcement')
  @ApiOperation({ summary: '[Admin] Broadcast pengumuman ke semua user' })
  async sendAnnouncement(@CurrentUser() u: any, @Body() dto: AnnouncementDto) {
    return {
      status: true,
      data: await this.svc.broadcastAnnouncement(dto.message, u.id),
    };
  }
}
