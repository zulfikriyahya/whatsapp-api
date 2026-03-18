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
  UploadedFile,
  UseInterceptors,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { QueryContactsDto } from './dto/query-contacts.dto';
import { BulkDeleteContactsDto } from './dto/bulk-delete-contacts.dto';
import { ImportGoogleContactsDto } from './dto/import-google-contacts.dto';

@ApiTags('Contacts')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'contacts', version: '1' })
export class ContactsController {
  constructor(private svc: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar kontak' })
  async findAll(@CurrentUser() u: any, @Query() dto: QueryContactsDto) {
    const r = await this.svc.findAll(u.id, dto);
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

  @Post()
  @ApiOperation({ summary: 'Tambah kontak' })
  async create(@CurrentUser() u: any, @Body() dto: CreateContactDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update kontak' })
  async update(
    @CurrentUser() u: any,
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return { status: true, data: await this.svc.update(u.id, id, dto) };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus kontak' })
  async remove(@CurrentUser() u: any, @Param('id') id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus banyak kontak sekaligus' })
  async bulkDelete(@CurrentUser() u: any, @Body() dto: BulkDeleteContactsDto) {
    return { status: true, data: await this.svc.bulkDelete(u.id, dto) };
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Import kontak dari CSV' })
  async importCsv(
    @CurrentUser() u: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return { status: true, data: await this.svc.importCsv(u.id, file.buffer) };
  }

  @Post('import-google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Import kontak dari Google Contacts' })
  async importGoogle(
    @CurrentUser() u: any,
    @Body() dto: ImportGoogleContactsDto,
  ) {
    return {
      status: true,
      data: await this.svc.importFromGoogleContacts(u.id, dto.accessToken),
    };
  }

  @Get('export')
  @ApiOperation({ summary: 'Export kontak ke CSV' })
  async exportCsv(@CurrentUser() u: any, @Res() res: Response) {
    const csv = await this.svc.exportCsv(u.id);
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="contacts_${date}.csv"`,
    );
    res.send(csv);
  }
}
