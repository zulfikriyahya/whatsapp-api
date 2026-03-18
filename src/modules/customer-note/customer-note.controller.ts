import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomerNoteService } from './customer-note.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpsertNoteDto } from './dto/upsert-note.dto';

@ApiTags('Customer Note')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'contacts/:contactId/note', version: '1' })
export class CustomerNoteController {
  constructor(private svc: CustomerNoteService) {}

  @Get()
  @ApiOperation({ summary: 'Dapatkan catatan kontak' })
  async getNote(@CurrentUser() u: any, @Param('contactId') cid: string) {
    return { status: true, data: await this.svc.getNote(u.id, cid) };
  }

  @Put()
  @ApiOperation({ summary: 'Tambah atau update catatan kontak' })
  async upsertNote(
    @CurrentUser() u: any,
    @Param('contactId') cid: string,
    @Body() dto: UpsertNoteDto,
  ) {
    return {
      status: true,
      data: await this.svc.upsertNote(u.id, cid, dto.content),
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus catatan kontak' })
  async deleteNote(@CurrentUser() u: any, @Param('contactId') cid: string) {
    return { status: true, data: await this.svc.deleteNote(u.id, cid) };
  }
}
