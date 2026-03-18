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
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateScheduledMessageDto } from "./dto/create-scheduled-message.dto";
import { QueryScheduledMessagesDto } from "./dto/query-scheduled-messages.dto";

@ApiTags("Scheduler")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("scheduler")
@Controller({ path: "scheduler", version: "1" })
export class SchedulerController {
  constructor(private svc: SchedulerService) {}

  @Get()
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
  async create(@CurrentUser() u: any, @Body() dto: CreateScheduledMessageDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }
  @Post(":id/cancel")
  @HttpCode(HttpStatus.OK)
  async cancel(@CurrentUser() u: any, @Param("id") id: string) {
    return { status: true, data: await this.svc.cancel(u.id, id) };
  }
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }
}
