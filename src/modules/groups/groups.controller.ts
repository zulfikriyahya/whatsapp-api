import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { GroupsService } from "./groups.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Groups")
@UseGuards(JwtAuthGuard)
@Controller({ path: "groups", version: "1" })
export class GroupsController {
  constructor(private svc: GroupsService) {}

  @Post()
  @ApiOperation({ summary: "Buat grup baru" })
  async create(
    @Body() body: { sessionId: string; name: string; participants: string[] },
  ) {
    return {
      status: true,
      data: await this.svc.create(body.sessionId, body.name, body.participants),
    };
  }

  @Get(":sessionId/:groupId")
  @ApiOperation({ summary: "Info grup" })
  async getInfo(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
  ) {
    return { status: true, data: await this.svc.getInfo(sid, gid) };
  }

  @Post(":sessionId/:groupId/participants/add")
  @HttpCode(HttpStatus.OK)
  async addParticipants(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() body: { participants: string[] },
  ) {
    return {
      status: true,
      data: await this.svc.addParticipants(sid, gid, body.participants),
    };
  }

  @Post(":sessionId/:groupId/participants/remove")
  @HttpCode(HttpStatus.OK)
  async removeParticipants(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() body: { participants: string[] },
  ) {
    return {
      status: true,
      data: await this.svc.removeParticipants(sid, gid, body.participants),
    };
  }

  @Post(":sessionId/:groupId/participants/promote")
  @HttpCode(HttpStatus.OK)
  async promoteParticipants(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() body: { participants: string[] },
  ) {
    return {
      status: true,
      data: await this.svc.promoteParticipants(sid, gid, body.participants),
    };
  }

  @Post(":sessionId/:groupId/participants/demote")
  @HttpCode(HttpStatus.OK)
  async demoteParticipants(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() body: { participants: string[] },
  ) {
    return {
      status: true,
      data: await this.svc.demoteParticipants(sid, gid, body.participants),
    };
  }

  @Post(":sessionId/:groupId/subject")
  @HttpCode(HttpStatus.OK)
  async updateSubject(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() body: { subject: string },
  ) {
    return {
      status: true,
      data: await this.svc.updateSubject(sid, gid, body.subject),
    };
  }

  @Post(":sessionId/:groupId/description")
  @HttpCode(HttpStatus.OK)
  async updateDescription(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
    @Body() body: { description: string },
  ) {
    return {
      status: true,
      data: await this.svc.updateDescription(sid, gid, body.description),
    };
  }

  @Post(":sessionId/:groupId/leave")
  @HttpCode(HttpStatus.OK)
  async leave(@Param("sessionId") sid: string, @Param("groupId") gid: string) {
    return { status: true, data: await this.svc.leave(sid, gid) };
  }

  @Get(":sessionId/:groupId/invite")
  async getInviteCode(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
  ) {
    return { status: true, data: await this.svc.getInviteCode(sid, gid) };
  }

  @Post(":sessionId/:groupId/invite/revoke")
  @HttpCode(HttpStatus.OK)
  async revokeInvite(
    @Param("sessionId") sid: string,
    @Param("groupId") gid: string,
  ) {
    return { status: true, data: await this.svc.revokeInvite(sid, gid) };
  }

  @Post(":sessionId/join")
  @HttpCode(HttpStatus.OK)
  async join(
    @Param("sessionId") sid: string,
    @Body() body: { inviteCode: string },
  ) {
    return {
      status: true,
      data: await this.svc.joinViaInvite(sid, body.inviteCode),
    };
  }

  @Get(":sessionId/invite/:inviteCode/info")
  async getInviteInfo(
    @Param("sessionId") sid: string,
    @Param("inviteCode") code: string,
  ) {
    return { status: true, data: await this.svc.getInviteInfo(sid, code) };
  }
}
