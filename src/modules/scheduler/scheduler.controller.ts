import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SchedulerService } from "./scheduler.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateScheduledMessageDto } from "./dto/create-scheduled-message.dto";
import { QueryScheduledMessagesDto } from "./dto/query-scheduled-messages.dto";

@ApiTags("Scheduler")
@UseGuards(JwtAuthGuard)
@Controller({ path: "scheduler", version: "1" })
export class SchedulerController {
  constructor(private svc: SchedulerService) {}

  @Get()
  @ApiOperation({ summary: "Daftar pesan terjadwal" })
  async findAll(
    @CurrentUser() u: any,
    @Query() dto: QueryScheduledMessagesDto,
  ) {
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
  @ApiOperation({ summary: "Buat pesan terjadwal" })
  async create(@CurrentUser() u: any, @Body() dto: CreateScheduledMessageDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }

  @Post(":id/cancel")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Batalkan pesan terjadwal" })
  async cancel(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.cancel(u.id, id) };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus pesan terjadwal" })
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }
}
