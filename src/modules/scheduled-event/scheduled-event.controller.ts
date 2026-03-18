import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScheduledEventService } from './scheduled-event.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateScheduledEventDto } from './dto/create-scheduled-event.dto';
import { RespondEventDto } from './dto/respond-event.dto';

@ApiTags('Scheduled Event')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'scheduled-events', version: '1' })
export class ScheduledEventController {
  constructor(private svc: ScheduledEventService) {}

  @Post('send')
  @ApiOperation({ summary: 'Kirim undangan Scheduled Event ke WA' })
  async send(@CurrentUser() u: any, @Body() dto: CreateScheduledEventDto) {
    return { status: true, data: await this.svc.send(u.id, dto) };
  }

  @Post('respond')
  @ApiOperation({
    summary: 'Accept atau decline Scheduled Event yang diterima',
  })
  async respond(@CurrentUser() u: any, @Body() dto: RespondEventDto) {
    return { status: true, data: await this.svc.respond(u.id, dto) };
  }
}
