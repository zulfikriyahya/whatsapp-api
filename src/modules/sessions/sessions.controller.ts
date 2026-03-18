import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { SessionsService } from "./sessions.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateSessionDto } from "./dto/create-session.dto";

@ApiTags("Sessions")
@UseGuards(JwtAuthGuard)
@Controller({ path: "sessions", version: "1" })
export class SessionsController {
  constructor(private svc: SessionsService) {}

  @Get()
  @ApiOperation({ summary: "Daftar sesi WA" })
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }

  @Post()
  @ApiOperation({ summary: "Tambah sesi baru" })
  async create(
    @CurrentUser() u: any,
    @Body() dto: CreateSessionDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.create(
        u.id,
        u.email,
        dto,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @Post(":id/reconnect")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reconnect sesi" })
  async reconnect(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.reconnect(
        u.id,
        id,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @Post(":id/default")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Set sesi sebagai default" })
  async setDefault(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.setDefault(u.id, id) };
  }

  @Get(":id/info")
  @ApiOperation({ summary: "Info sesi (state, version)" })
  async info(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.getInfo(u.id, id) };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus / logout sesi" })
  async remove(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Req() req: Request,
  ) {
    await this.svc.delete(u.id, u.email, id, req.ip, req.headers["user-agent"]);
    return { status: true };
  }
}

