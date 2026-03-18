import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ChatsService } from "./chats.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("Chats")
@UseGuards(JwtAuthGuard)
@Controller({ path: "chats", version: "1" })
export class ChatsController {
  constructor(private svc: ChatsService) {}

  @Get(":sessionId") async getAll(@Param("sessionId") sid: string) {
    return { status: true, data: await this.svc.getAll(sid) };
  }
  @Get(":sessionId/:chatId") async getById(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.getById(sid, cid) };
  }
  @Post(":sessionId/:chatId/archive") @HttpCode(HttpStatus.OK) async archive(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.archive(sid, cid) };
  }
  @Post(":sessionId/:chatId/unarchive")
  @HttpCode(HttpStatus.OK)
  async unarchive(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.unarchive(sid, cid) };
  }
  @Post(":sessionId/:chatId/mute") @HttpCode(HttpStatus.OK) async mute(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
    @Body() b: { duration?: number },
  ) {
    return { status: true, data: await this.svc.mute(sid, cid, b.duration) };
  }
  @Post(":sessionId/:chatId/unmute") @HttpCode(HttpStatus.OK) async unmute(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.unmute(sid, cid) };
  }
  @Post(":sessionId/:chatId/pin") @HttpCode(HttpStatus.OK) async pin(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.pin(sid, cid) };
  }
  @Post(":sessionId/:chatId/unpin") @HttpCode(HttpStatus.OK) async unpin(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.unpin(sid, cid) };
  }
  @Delete(":sessionId/:chatId") @HttpCode(HttpStatus.OK) async delete(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.delete(sid, cid) };
  }
  @Post(":sessionId/:chatId/read") @HttpCode(HttpStatus.OK) async markRead(
    @Param("sessionId") sid: string,
    @Param("chatId") cid: string,
  ) {
    return { status: true, data: await this.svc.markRead(sid, cid) };
  }
  @Get(":sessionId/search") async search(
    @Param("sessionId") sid: string,
    @Query("q") q: string,
  ) {
    return { status: true, data: await this.svc.search(sid, q) };
  }
}
