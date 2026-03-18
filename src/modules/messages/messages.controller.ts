import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { SendMediaDto } from './dto/send-media.dto';
import { SendLocationDto } from './dto/send-location.dto';
import { SendPollDto } from './dto/send-poll.dto';
import { SendContactDto } from './dto/send-contact.dto';
import { ReactMessageDto } from './dto/react-message.dto';
import { QueryMessagesDto } from './dto/query-messages.dto';

@ApiTags('Messages')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'messages', version: '1' })
export class MessagesController {
  constructor(
    private svc: MessagesService,
    private cfg: ConfigService,
  ) {}

  @Post('send')
  @ApiOperation({ summary: 'Kirim pesan teks' })
  async send(@CurrentUser() u: any, @Body() dto: SendMessageDto) {
    return { status: true, data: await this.svc.send(u.id, dto) };
  }

  @Post('send-media')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Kirim pesan media' })
  async sendMedia(
    @CurrentUser() u: any,
    @Body() dto: SendMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return { status: true, data: await this.svc.sendMedia(u.id, dto, file) };
  }

  @Post('send-location')
  @ApiOperation({ summary: 'Kirim lokasi' })
  async sendLocation(@CurrentUser() u: any, @Body() dto: SendLocationDto) {
    return { status: true, data: await this.svc.sendLocation(u.id, dto) };
  }

  @Post('send-poll')
  @ApiOperation({ summary: 'Kirim poll' })
  async sendPoll(@CurrentUser() u: any, @Body() dto: SendPollDto) {
    return { status: true, data: await this.svc.sendPoll(u.id, dto) };
  }

  @Post('send-contact')
  @ApiOperation({ summary: 'Kirim kontak sebagai vCard' })
  async sendContact(@CurrentUser() u: any, @Body() dto: SendContactDto) {
    return { status: true, data: await this.svc.sendContact(u.id, dto) };
  }

  @Patch(':sessionId/messages/:messageId/edit')
  @ApiOperation({ summary: 'Edit pesan yang sudah dikirim' })
  async editMessage(
    @CurrentUser() u: any,
    @Param('sessionId') sid: string,
    @Param('messageId') mid: string,
    @Body() body: { text: string },
  ) {
    return {
      status: true,
      data: await this.svc.editMessage(u.id, sid, mid, body.text),
    };
  }

  @Post(':sessionId/messages/:messageId/forward')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forward pesan ke nomor lain' })
  async forwardMessage(
    @CurrentUser() u: any,
    @Param('sessionId') sid: string,
    @Param('messageId') mid: string,
    @Body() body: { to: string },
  ) {
    return {
      status: true,
      data: await this.svc.forwardMessage(u.id, sid, mid, body.to),
    };
  }

  @Post(':sessionId/messages/:messageId/pin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pin pesan di chat' })
  async pinMessage(
    @CurrentUser() u: any,
    @Param('sessionId') sid: string,
    @Param('messageId') mid: string,
    @Body() body: { duration?: number },
  ) {
    return {
      status: true,
      data: await this.svc.pinMessage(u.id, sid, mid, body.duration),
    };
  }

  @Post(':sessionId/messages/:messageId/unpin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unpin pesan' })
  async unpinMessage(
    @CurrentUser() u: any,
    @Param('sessionId') sid: string,
    @Param('messageId') mid: string,
  ) {
    return { status: true, data: await this.svc.unpinMessage(u.id, sid, mid) };
  }

  @Post(':sessionId/messages/:messageId/download')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Download media dari pesan masuk' })
  async downloadMedia(
    @CurrentUser() u: any,
    @Param('sessionId') sid: string,
    @Param('messageId') mid: string,
  ) {
    const storagePath = this.cfg.get<string>('app.storagePath');
    return {
      status: true,
      data: await this.svc.downloadMedia(u.id, sid, mid, storagePath),
    };
  }

  @Post(':sessionId/messages/:messageId/react')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'React pesan dengan emoji' })
  async react(
    @CurrentUser() u: any,
    @Param('sessionId') sid: string,
    @Param('messageId') mid: string,
    @Body() dto: ReactMessageDto,
  ) {
    return {
      status: true,
      data: await this.svc.reactMessage(u.id, sid, mid, dto.reaction),
    };
  }

  @Delete(':sessionId/messages/:messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus pesan' })
  async delete(
    @CurrentUser() u: any,
    @Param('sessionId') sid: string,
    @Param('messageId') mid: string,
    @Query('forEveryone') forEveryone?: string,
  ) {
    return {
      status: true,
      data: await this.svc.deleteMessage(
        u.id,
        sid,
        mid,
        forEveryone !== 'false',
      ),
    };
  }

  @Get('check/:sessionId/:phone')
  @ApiOperation({ summary: 'Cek nomor terdaftar di WA' })
  async checkRegistered(
    @CurrentUser() u: any,
    @Param('sessionId') sid: string,
    @Param('phone') phone: string,
  ) {
    return {
      status: true,
      data: await this.svc.isRegisteredUser(u.id, sid, phone),
    };
  }

  @Get('logs')
  @ApiOperation({ summary: 'Riwayat pesan' })
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

  @Get('logs/export-pdf')
  @ApiOperation({ summary: 'Export riwayat pesan sebagai PDF' })
  async exportLogsPdf(
    @CurrentUser() u: any,
    @Query() dto: QueryMessagesDto,
    @Res() res: Response,
  ) {
    const buffer = await this.svc.exportLogsPdf(u.id, dto);
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="messages_${date}.pdf"`,
    );
    res.send(buffer);
  }
}
