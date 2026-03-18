import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberPermissionDto } from './dto/update-member-permission.dto';

@ApiTags('Workspace')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'workspaces', version: '1' })
export class WorkspaceController {
  constructor(private svc: WorkspaceService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar workspace yang diikuti' })
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }

  @Post()
  @ApiOperation({ summary: 'Buat workspace baru' })
  async create(
    @CurrentUser() u: any,
    @Body() dto: CreateWorkspaceDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.create(
        u.id,
        u.email,
        dto.name,
        req.ip,
        req.headers['user-agent'],
      ),
    };
  }

  @Post(':id/invite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Undang anggota ke workspace' })
  async invite(
    @CurrentUser() u: any,
    @Param('id') id: string,
    @Body() dto: InviteMemberDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.invite(
        u.id,
        u.email,
        id,
        dto.email,
        req.ip,
        req.headers['user-agent'],
      ),
    };
  }

  @Put(':id/members/:memberId/permission')
  @ApiOperation({ summary: 'Update role atau permission anggota workspace' })
  async updateMemberPermission(
    @CurrentUser() u: any,
    @Param('id') id: string,
    @Param('memberId') mid: string,
    @Body() dto: UpdateMemberPermissionDto,
  ) {
    return {
      status: true,
      data: await this.svc.updateMemberPermission(u.id, id, mid, dto),
    };
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus anggota dari workspace' })
  async removeMember(
    @CurrentUser() u: any,
    @Param('id') id: string,
    @Param('memberId') mid: string,
    @Req() req: Request,
  ) {
    await this.svc.removeMember(
      u.id,
      u.email,
      id,
      mid,
      req.ip,
      req.headers['user-agent'],
    );
    return { status: true };
  }
}
