import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { ManageMembersDto } from './dto/manage-members.dto';
import { ManageAdminsDto } from './dto/manage-admins.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { MembershipRequestDto } from './dto/membership-request.dto';

@ApiTags('Groups')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'groups', version: '1' })
export class GroupsController {
  constructor(private svc: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Buat grup baru' })
  async create(@Param('sessionId') sid: string, @Body() dto: CreateGroupDto) {
    return {
      status: true,
      data: await this.svc.create(sid, dto.name, dto.participants),
    };
  }

  @Get(':sessionId/:groupId')
  @ApiOperation({ summary: 'Info grup' })
  async getInfo(
    @Param('sessionId') sid: string,
    @Param('groupId') gid: string,
  ) {
    return { status: true, data: await this.svc.getInfo(sid, gid) };
  }

  @Post(':sessionId/:groupId/participants/add')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tambah anggota grup' })
  async addParticipants(
    @Param('sessionId') sid: string,
    @Param('groupId') gid: string,
    @Body() dto: ManageMembersDto,
  ) {
    return {
      status: true,
      data: await this.svc.addParticipants(sid, gid, dto.participants),
    };
  }

  @Post(':sessionId/:groupId/participants/remove')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus anggota grup' })
  async removeParticipants(
    @Param('sessionId') sid: string,
    @Param('groupId') gid: string,
    @Body() dto: ManageMembersDto,
  ) {
    return {
      status: true,
      data: await this.svc.removeParticipants(sid, gid, dto.participants),
    };
  }

  @Post(':sessionId/:groupId/participants/promote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Promosi anggota menjadi admin' })
  async promoteParticipants(
    @Param('sessionId') sid: string,
    @Param('groupId') gid: string,
    @Body() dto: ManageAdminsDto,
  ) {
    return {
      status: true,
      data: await this.svc.promoteParticipants(sid, gid, dto.participants),
    };
  }

  @Post(':sessionId/:groupId/participants/demote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demosi admin menjadi anggota biasa' })
  async demoteParticipants(
    @Param('sessionId') sid: string,
    @Param('groupId') gid: string,
    @Body() dto: ManageAdminsDto,
  ) {
    return {
      status: true,
      data: await this.svc.demoteParticipants(sid, gid, dto.participants),
    };
  }

  @Post(':sessionId/:groupId/update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update nama dan deskripsi grup' })
  async updateGroup(
    @Param('sessionId') sid: string,
    @Param('groupId') gid: string,
    @Body() dto: UpdateGroupDto,
  ) {
    const results: any = {};
    if (dto.subject)
      results.subject = await this.svc.updateSubject(sid, gid, dto.subject);
    if (dto.description)
      results.description = await this.svc.updateDescription(
        sid,
        gid,
        dto.description,
      );
    return { status: true, data: results };
  }

  @Post(':sessionId/:groupId/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Keluar dari grup' })
  async leave(@Param('sessionId') sid: string, @Param('groupId') gid: string) {
    return { status: true, data: await this.svc.leave(sid, gid) };
  }

  @Get(':sessionId/:groupId/invite')
  @ApiOperation({ summary: 'Dapatkan invite link grup' })
  async getInviteCode(
    @Param('sessionId') sid: string,
    @Param('groupId') gid: string,
  ) {
    return { status: true, data: await this.svc.getInviteCode(sid, gid) };
  }

  @Post(':sessionId/:groupId/invite/revoke')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke invite link grup' })
  async revokeInvite(
    @Param('sessionId') sid: string,
    @Param('groupId') gid: string,
  ) {
    return { status: true, data: await this.svc.revokeInvite(sid, gid) };
  }

  @Post(':sessionId/join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join grup via invite code' })
  async join(
    @Param('sessionId') sid: string,
    @Body() body: { inviteCode: string },
  ) {
    return {
      status: true,
      data: await this.svc.joinViaInvite(sid, body.inviteCode),
    };
  }

  @Get(':sessionId/invite/:inviteCode/info')
  @ApiOperation({ summary: 'Dapatkan info grup sebelum join' })
  async getInviteInfo(
    @Param('sessionId') sid: string,
    @Param('inviteCode') code: string,
  ) {
    return { status: true, data: await this.svc.getInviteInfo(sid, code) };
  }

  @Post(':sessionId/:groupId/membership-request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve atau reject join request' })
  async handleMembershipRequest(
    @Param('sessionId') sid: string,
    @Param('groupId') gid: string,
    @Body() dto: MembershipRequestDto,
  ) {
    return {
      status: true,
      data: await this.svc.handleMembershipRequest(sid, gid, dto),
    };
  }

  @Get(':sessionId/:groupId/membership-requests')
  @ApiOperation({ summary: 'Dapatkan daftar join request yang pending' })
  async getMembershipRequests(
    @Param('sessionId') sid: string,
    @Param('groupId') gid: string,
  ) {
    return {
      status: true,
      data: await this.svc.getMembershipRequests(sid, gid),
    };
  }

  @Get(':sessionId/contacts/:contactId/common-groups')
  @ApiOperation({ summary: 'Dapatkan grup yang sama antara bot dan kontak' })
  async getCommonGroups(
    @Param('sessionId') sid: string,
    @Param('contactId') cid: string,
  ) {
    return { status: true, data: await this.svc.getCommonGroups(sid, cid) };
  }
}
