import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { MessagesService } from "./messages.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ApiKeyGuard } from "../../common/guards/api-key.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SendMessageDto } from "./dto/send-message.dto";
import { SendMediaDto } from "./dto/send-media.dto";
import { SendLocationDto } from "./dto/send-location.dto";
import { SendPollDto } from "./dto/send-poll.dto";
import { ReactMessageDto } from "./dto/react-message.dto";
import { QueryMessagesDto } from "./dto/query-messages.dto";

@ApiTags("Messages")
@Controller({ path: "messages", version: "1" })
export class MessagesController {
  constructor(private svc: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post("send")
  @ApiOperation({ summary: "Kirim pesan teks" })
  async send(@CurrentUser() u: any, @Body() dto: SendMessageDto) {
    return { status: true, data: await this.svc.send(u.id, dto) };
  }

  @UseGuards(JwtAuthGuard)
  @Post("send-media")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Kirim pesan media" })
  async sendMedia(
    @CurrentUser() u: any,
    @Body() dto: SendMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return { status: true, data: await this.svc.sendMedia(u.id, dto, file) };
  }

  @UseGuards(JwtAuthGuard)
  @Post("send-location")
  @ApiOperation({ summary: "Kirim lokasi" })
  async sendLocation(@CurrentUser() u: any, @Body() dto: SendLocationDto) {
    return { status: true, data: await this.svc.sendLocation(u.id, dto) };
  }

  @UseGuards(JwtAuthGuard)
  @Post("send-poll")
  @ApiOperation({ summary: "Kirim poll" })
  async sendPoll(@CurrentUser() u: any, @Body() dto: SendPollDto) {
    return { status: true, data: await this.svc.sendPoll(u.id, dto) };
  }

  @UseGuards(JwtAuthGuard)
  @Post(":sessionId/messages/:messageId/react")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "React pesan dengan emoji" })
  async react(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("messageId") mid: string,
    @Body() dto: ReactMessageDto,
  ) {
    return {
      status: true,
      data: await this.svc.reactMessage(u.id, sid, mid, dto.reaction),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":sessionId/messages/:messageId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus pesan" })
  async delete(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("messageId") mid: string,
  ) {
    return { status: true, data: await this.svc.deleteMessage(u.id, sid, mid) };
  }

  @UseGuards(JwtAuthGuard)
  @Get("check/:sessionId/:phone")
  @ApiOperation({ summary: "Cek nomor terdaftar di WA" })
  async checkRegistered(
    @CurrentUser() u: any,
    @Param("sessionId") sid: string,
    @Param("phone") phone: string,
  ) {
    return {
      status: true,
      data: await this.svc.isRegisteredUser(u.id, sid, phone),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("logs")
  @ApiOperation({ summary: "Riwayat pesan" })
  async logs(@CurrentUser() u: any, @Query() dto: QueryMessagesDto) {
    const r = await this.svc.getLogs(u.id, dto);
    return {
      status: true,
      data: r.data,
      meta: {
        total: r.total,
        page: r.page,
        limit: r.limit,
        totalPages: r.totalPages,
      },
    };
  }
}
