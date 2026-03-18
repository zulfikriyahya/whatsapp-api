import {
  Controller,
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
import { ImpersonationService } from "./impersonation.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Role } from "../../common/enums/role.enum";
import { ImpersonateDto } from "./dto/impersonate.dto";

@ApiTags("Admin — Impersonation")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller({ path: "admin/impersonate", version: "1" })
export class ImpersonationController {
  constructor(private svc: ImpersonationService) {}

  /**
   * POST /admin/impersonate
   * Generate JWT sementara atas nama user target.
   * Token dikembalikan di response — client menggunakannya sebagai Bearer token
   * atau set cookie manual untuk sesi support.
   */
  @Post()
  @ApiOperation({
    summary: "[Admin] Impersonate user — generate token sementara",
  })
  async impersonate(
    @CurrentUser() admin: any,
    @Body() dto: ImpersonateDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.impersonate(
        admin.id,
        admin.email,
        dto.userId,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  /**
   * DELETE /admin/impersonate/:targetUserId
   * Akhiri sesi impersonation — invalidasi token di Redis.
   */
  @Delete(":targetUserId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "[Admin] Akhiri sesi impersonation" })
  async exit(
    @CurrentUser() admin: any,
    @Param("targetUserId") targetUserId: string,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.exitImpersonation(
        admin.id,
        admin.email,
        targetUserId,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }
}
