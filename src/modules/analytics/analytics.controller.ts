import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { QueryAnalyticsDto } from "./dto/query-analytics.dto";

@ApiTags("Analytics")
@UseGuards(JwtAuthGuard)
@Controller({ path: "analytics", version: "1" })
export class AnalyticsController {
  constructor(private svc: AnalyticsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Data dashboard & statistik" })
  async dashboard(@CurrentUser() u: any, @Query() dto: QueryAnalyticsDto) {
    return { status: true, data: await this.svc.getDashboard(u.id, dto.days) };
  }

  @Get("system")
  @ApiOperation({ summary: "Status sistem & resource server" })
  async system() {
    return { status: true, data: await this.svc.getSystemStatus() };
  }
}
