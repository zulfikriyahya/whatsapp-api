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
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Request } from "express";
import { TiersService } from "./tiers.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Role } from "../../common/enums/role.enum";
import { CreateTierDto } from "./dto/create-tier.dto";
import { UpdateTierDto } from "./dto/update-tier.dto";
import { AssignTierDto } from "./dto/assign-tier.dto";

@ApiTags("Tiers")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: "tiers", version: "1" })
export class TiersController {
  constructor(private svc: TiersService) {}

  @Get()
  @ApiOperation({ summary: "Daftar tier" })
  async findAll() {
    return { status: true, data: await this.svc.findAll() };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  async create(@Body() dto: CreateTierDto) {
    return { status: true, data: await this.svc.create(dto) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateTierDto) {
    return { status: true, data: await this.svc.update(id, dto) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string) {
    await this.svc.remove(id);
    return { status: true };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post("assign")
  async assign(
    @CurrentUser() u: any,
    @Body() dto: AssignTierDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.assignToUser(
        u.id,
        u.email,
        dto,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  /**
   * FIX: Riwayat perubahan tier per user — query audit log dengan
   * filter action ASSIGN_TIER dan details.userId = targetUserId
   */
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get("history/:userId")
  @ApiOperation({ summary: "[Admin] Riwayat perubahan tier user" })
  async getTierHistory(
    @Param("userId") userId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
  ) {
    return {
      status: true,
      data: await this.svc.getTierHistory(userId, +page, +limit),
    };
  }
}
