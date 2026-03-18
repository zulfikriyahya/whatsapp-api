import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LabelsService } from "./labels.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";

@ApiTags("Labels")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("labels")
@Controller({ path: "labels", version: "1" })
export class LabelsController {
  constructor(private svc: LabelsService) {}

  @Get(":sessionId")
  async getAll(@Param("sessionId") sid: string) {
    return { status: true, data: await this.svc.getAll(sid) };
  }
  @Get(":sessionId/:labelId")
  async getById(
    @Param("sessionId") sid: string,
    @Param("labelId") lid: string,
  ) {
    return { status: true, data: await this.svc.getById(sid, lid) };
  }
  @Post(":sessionId/chats/:chatId/labels/:labelId")
  @HttpCode(HttpStatus.OK)
  async addToChat(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
    @Param("labelId") lid: string,
  ) {
    return { status: true, data: await this.svc.addToChat(sid, cid, lid) };
  }
  @Post(":sessionId/chats/:chatId/labels/:labelId/remove")
  @HttpCode(HttpStatus.OK)
  async removeFromChat(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
    @Param("labelId") lid: string,
  ) {
    return { status: true, data: await this.svc.removeFromChat(sid, cid, lid) };
  }
  @Get(":sessionId/labels/:labelId/chats")
  async getChatsByLabel(
    @Param("sessionId") sid: string,
    @Param("labelId") lid: string,
  ) {
    return { status: true, data: await this.svc.getChatsByLabel(sid, lid) };
  }
}
