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
  Res, // FIX: import Res dari @nestjs/common
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Response } from "express"; // FIX: import Response dari express
import { BroadcastService } from "./broadcast.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { QuotaGuard, QuotaType } from "../../common/guards/quota.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
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

  @Get("campaigns/:id")
  @ApiOperation({ summary: "Detail campaign broadcast" })
  async findOne(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.findOne(u.id, id) };
  }

  @Get("campaigns/:id/export-pdf")
  @ApiOperation({ summary: "Export hasil campaign ke PDF" })
  async exportCampaignPdf(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Res() res: Response,
  ) {
    const buffer = await this.svc.exportCampaignPdf(u.id, id);
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="campaign_${id}_${date}.pdf"`,
    );
    res.send(buffer);
  }

  @Post()
  @UseGuards(TierFeatureGuard, QuotaGuard)
  @RequireFeature("broadcast")
  @QuotaType("monthly")
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
