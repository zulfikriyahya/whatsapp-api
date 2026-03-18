import {
  Controller,
  Get,
  Post,
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

@ApiTags("Channels")
@UseGuards(JwtAuthGuard)
@Controller({ path: "channels", version: "1" })
export class ChannelsController {
  constructor(private svc: ChannelsService) {}

  @Get(":sessionId")
  async getAll(@Param("sessionId") sid: string) {
    return { status: true, data: await this.svc.getAll(sid) };
  }

  @Get(":sessionId/search")
  async search(@Param("sessionId") sid: string, @Query("q") q: string) {
    return { status: true, data: await this.svc.search(sid, q) };
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
}
