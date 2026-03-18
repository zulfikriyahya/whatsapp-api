import {
  Controller,
  Get,
  Post,
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
import { BroadcastService } from "./broadcast.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateBroadcastDto } from "./dto/create-broadcast.dto";
import { QueryCampaignsDto } from "./dto/query-campaigns.dto";

@ApiTags("Broadcast")
@UseGuards(JwtAuthGuard)
@Controller({ path: "broadcast", version: "1" })
export class BroadcastController {
  constructor(private svc: BroadcastService) {}

  @Get("campaigns")
  @ApiOperation({ summary: "Daftar campaign broadcast" })
  async findAll(@CurrentUser() u: any, @Query() dto: QueryCampaignsDto) {
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
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Buat broadcast baru" })
  async create(
    @CurrentUser() u: any,
    @Body() dto: CreateBroadcastDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return { status: true, data: await this.svc.create(u.id, dto, file) };
  }

  @Post("campaigns/:id/cancel")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Batalkan broadcast" })
  async cancel(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.cancel(u.id, id) };
  }
}
