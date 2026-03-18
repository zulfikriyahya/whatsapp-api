import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ChannelsService } from "./channels.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { SearchChannelDto } from "./dto/search-channel.dto";
import { ManageChannelAdminDto } from "./dto/manage-channel-admin.dto";

@ApiTags("Channels")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("channels")
@Controller({ path: "channels", version: "1" })
export class ChannelsController {
  constructor(private svc: ChannelsService) {}

  @Get(":sessionId")
  async getAll(@Param("sessionId") sid: string) {
    return { status: true, data: await this.svc.getAll(sid) };
  }
  @Get(":sessionId/search")
  async search(
    @Param("sessionId") sid: string,
    @Query() dto: SearchChannelDto,
  ) {
    return { status: true, data: await this.svc.search(sid, dto.query) };
  }
  @Get(":sessionId/invite/:inviteCode")
  async getByInviteCode(
    @Param("sessionId") sid: string,
    @Param("inviteCode") code: string,
  ) {
    return { status: true, data: await this.svc.getByInviteCode(sid, code) };
  }
  @Post(":sessionId/:channelId/subscribe")
  @HttpCode(HttpStatus.OK)
  async subscribe(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
  ) {
    return { status: true, data: await this.svc.subscribe(sid, cid) };
  }
  @Post(":sessionId/:channelId/unsubscribe")
  @HttpCode(HttpStatus.OK)
  async unsubscribe(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
  ) {
    return { status: true, data: await this.svc.unsubscribe(sid, cid) };
  }
  @Post(":sessionId/:channelId/send")
  async send(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
    @Body() body: { message: string },
  ) {
    return { status: true, data: await this.svc.send(sid, cid, body.message) };
  }
  @Post(":sessionId/:channelId/admin")
  @HttpCode(HttpStatus.OK)
  async manageAdmin(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
    @Body() dto: ManageChannelAdminDto,
  ) {
    return {
      status: true,
      data: await this.svc.manageAdmin(
        sid,
        cid,
        dto.participantJid,
        dto.action as "add" | "remove",
      ),
    };
  }
  @Post(":sessionId/:channelId/transfer")
  @HttpCode(HttpStatus.OK)
  async transferOwnership(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
    @Body() body: { newOwnerJid: string },
  ) {
    return {
      status: true,
      data: await this.svc.transferOwnership(sid, cid, body.newOwnerJid),
    };
  }
  @Put(":sessionId/:channelId")
  async update(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
    @Body() dto: UpdateChannelDto,
  ) {
    return {
      status: true,
      data: await this.svc.update(sid, cid, dto.name, dto.description),
    };
  }
  @Delete(":sessionId/:channelId")
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param("sessionId") sid: string,
    @Param("channelId") cid: string,
  ) {
    return { status: true, data: await this.svc.delete(sid, cid) };
  }
}
