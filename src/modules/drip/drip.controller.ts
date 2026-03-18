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
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { DripService } from "./drip.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateDripDto } from "./dto/create-drip.dto";
import { UpdateDripDto } from "./dto/update-drip.dto";
import { ToggleDripDto } from "./dto/toggle-drip.dto";
import { QuerySubscribersDto } from "./dto/query-subscribers.dto";

@ApiTags("Drip Campaign")
@UseGuards(JwtAuthGuard)
@Controller({ path: "drip-campaigns", version: "1" })
export class DripController {
  constructor(private svc: DripService) {}

  @Get()
  @ApiOperation({ summary: "Daftar drip campaign" })
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }

  @Post()
  @ApiOperation({ summary: "Buat drip campaign" })
  async create(@CurrentUser() u: any, @Body() dto: CreateDripDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }

  @Put(":id")
  @ApiOperation({ summary: "Update drip campaign" })
  async update(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: UpdateDripDto,
  ) {
    return { status: true, data: await this.svc.update(u.id, id, dto) };
  }

  @Post(":id/toggle")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Aktifkan / nonaktifkan drip campaign" })
  async toggle(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: ToggleDripDto,
  ) {
    return {
      status: true,
      data: await this.svc.toggle(u.id, id, dto.isActive),
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus drip campaign" })
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }

  @Get(":id/subscribers")
  @ApiOperation({ summary: "Daftar subscriber drip campaign" })
  async getSubscribers(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Query() dto: QuerySubscribersDto,
  ) {
    const r = await this.svc.getSubscribers(u.id, id, dto);
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

  @Post("subscriptions/:id/cancel")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Batalkan subscription kontak" })
  async cancelSubscription(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.cancelSubscription(u.id, id) };
  }
}
