import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuditService } from "./audit.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Role } from "../../common/enums/role.enum";
import { QueryAuditDto } from "./dto/query-audit.dto";

@ApiTags("Audit")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: "audit", version: "1" })
export class AuditController {
  constructor(private svc: AuditService) {}

  @Get()
  @ApiOperation({ summary: "Riwayat audit log" })
  async findAll(@CurrentUser() u: any, @Query() dto: QueryAuditDto) {
    const isAdmin = [Role.ADMIN, Role.SUPER_ADMIN].includes(u.role);
    const filters = {
      ...(isAdmin ? {} : { userId: u.id }),
      action: dto.action,
      from: dto.from ? new Date(dto.from) : undefined,
      to: dto.to ? new Date(dto.to) : undefined,
      page: dto.page,
      limit: dto.limit,
    };
    const r = await this.svc.findAll(filters);
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
}
