import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'profile', version: '1' })
export class ProfileController {
  constructor(private svc: ProfileService) {}

  @Get(':sessionId')
  @ApiOperation({ summary: 'Dapatkan info profil akun WA' })
  async getProfile(@Param('sessionId') sid: string) {
    return { status: true, data: await this.svc.getProfile(sid) };
  }

  @Post(':sessionId/display-name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set display name akun WA' })
  async setDisplayName(
    @Param('sessionId') sid: string,
    @Body() body: { name: string },
  ) {
    return {
      status: true,
      data: await this.svc.setDisplayName(sid, body.name),
    };
  }

  @Post(':sessionId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set status/bio akun WA' })
  async setStatus(
    @Param('sessionId') sid: string,
    @Body() body: { status: string },
  ) {
    return { status: true, data: await this.svc.setStatus(sid, body.status) };
  }

  @Post(':sessionId/photo')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Upload foto profil akun WA' })
  async setPhoto(
    @Param('sessionId') sid: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return { status: true, data: await this.svc.setProfilePhoto(sid, file) };
  }

  @Delete(':sessionId/photo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hapus foto profil akun WA' })
  async deletePhoto(@Param('sessionId') sid: string) {
    return { status: true, data: await this.svc.deleteProfilePhoto(sid) };
  }

  @Get(':sessionId/contacts')
  @ApiOperation({ summary: 'Dapatkan semua kontak dari WA' })
  async getAllContacts(@Param('sessionId') sid: string) {
    return { status: true, data: await this.svc.getAllContacts(sid) };
  }

  @Get(':sessionId/contacts/:contactId')
  @ApiOperation({ summary: 'Dapatkan kontak by ID' })
  async getContact(
    @Param('sessionId') sid: string,
    @Param('contactId') cid: string,
  ) {
    return { status: true, data: await this.svc.getContactById(sid, cid) };
  }

  @Get(':sessionId/contacts/:contactId/photo')
  @ApiOperation({ summary: 'Dapatkan foto profil kontak' })
  async getContactPhoto(
    @Param('sessionId') sid: string,
    @Param('contactId') cid: string,
  ) {
    return {
      status: true,
      data: await this.svc.getContactProfilePhoto(sid, cid),
    };
  }

  @Post(':sessionId/contacts/:contactId/block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Blokir kontak' })
  async blockContact(
    @Param('sessionId') sid: string,
    @Param('contactId') cid: string,
  ) {
    return { status: true, data: await this.svc.blockContact(sid, cid) };
  }

  @Post(':sessionId/contacts/:contactId/unblock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unblokir kontak' })
  async unblockContact(
    @Param('sessionId') sid: string,
    @Param('contactId') cid: string,
  ) {
    return { status: true, data: await this.svc.unblockContact(sid, cid) };
  }

  @Get(':sessionId/contacts/blocked')
  @ApiOperation({ summary: 'Dapatkan daftar kontak yang diblokir' })
  async getBlockedContacts(@Param('sessionId') sid: string) {
    return { status: true, data: await this.svc.getBlockedContacts(sid) };
  }
}
