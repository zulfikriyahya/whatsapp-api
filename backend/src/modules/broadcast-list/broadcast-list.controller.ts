import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BroadcastListService } from './broadcast-list.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Broadcast List')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'broadcast-list', version: '1' })
export class BroadcastListController {
  constructor(private svc: BroadcastListService) {}

  @Get(':sessionId')
  @ApiOperation({ summary: 'Dapatkan semua broadcast list dari WA' })
  async getAll(@Param('sessionId') sid: string) {
    return { status: true, data: await this.svc.getAll(sid) };
  }

  @Get(':sessionId/:broadcastId')
  @ApiOperation({ summary: 'Dapatkan broadcast list by ID' })
  async getById(
    @Param('sessionId') sid: string,
    @Param('broadcastId') bid: string,
  ) {
    return { status: true, data: await this.svc.getById(sid, bid) };
  }

  @Post(':sessionId/:broadcastId/send')
  @ApiOperation({ summary: 'Kirim pesan ke broadcast list' })
  async send(
    @Param('sessionId') sid: string,
    @Param('broadcastId') bid: string,
    @Body() body: { message: string },
  ) {
    return { status: true, data: await this.svc.send(sid, bid, body.message) };
  }
}
