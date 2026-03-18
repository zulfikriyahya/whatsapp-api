import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AutoReplyService } from "./auto-reply.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateAutoReplyDto } from "./dto/create-auto-reply.dto";
import { UpdateAutoReplyDto } from "./dto/update-auto-reply.dto";
import { ToggleAutoReplyDto } from "./dto/toggle-auto-reply.dto";

@ApiTags("Auto Reply")
@UseGuards(JwtAuthGuard)
@Controller({ path: "auto-reply", version: "1" })
export class AutoReplyController {
  constructor(private svc: AutoReplyService) {}

  @Get()
  @ApiOperation({ summary: "Daftar rules auto reply" })
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }

  @Post()
  @ApiOperation({ summary: "Buat rule auto reply" })
  async create(@CurrentUser() u: any, @Body() dto: CreateAutoReplyDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }

  @Put(":id")
  @ApiOperation({ summary: "Update rule auto reply" })
  async update(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: UpdateAutoReplyDto,
  ) {
    return { status: true, data: await this.svc.update(u.id, id, dto) };
  }

  @Post(":id/toggle")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Aktifkan / nonaktifkan rule" })
  async toggle(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: ToggleAutoReplyDto,
  ) {
    return {
      status: true,
      data: await this.svc.toggle(u.id, id, dto.isActive),
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus rule auto reply" })
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }
}
