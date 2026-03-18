import {
  Controller,
  Get,
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
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Role } from "../../common/enums/role.enum";
import { QueryUsersDto } from "./dto/query-users.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateQuotaDto } from "./dto/update-quota.dto";

@ApiTags("Users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get("profile")
  @ApiOperation({ summary: "Profil user saat ini" })
  profile(@CurrentUser() u: any) {
    return { status: true, data: u };
  }

  @Put("profile")
  @ApiOperation({ summary: "Update profil" })
  async updateProfile(@CurrentUser() u: any, @Body() dto: UpdateProfileDto) {
    return { status: true, data: await this.svc.updateProfile(u.id, dto) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  @ApiOperation({ summary: "[Admin] Daftar semua user" })
  async findAll(@Query() dto: QueryUsersDto) {
    const r = await this.svc.findAll(dto);
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

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get(":id")
  @ApiOperation({ summary: "[Admin] Detail user" })
  async findOne(@Param("id") id: string) {
    return { status: true, data: await this.svc.findOne(id) };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(":id")
  @ApiOperation({ summary: "[Admin] Update user (role, isActive)" })
  async update(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.updateUser(
        u.id,
        u.email,
        id,
        dto,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "[Admin] Hapus user" })
  async remove(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Req() req: Request,
  ) {
    await this.svc.deleteUser(
      u.id,
      u.email,
      id,
      req.ip,
      req.headers["user-agent"],
    );
    return { status: true };
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(":id/quota")
  @ApiOperation({ summary: "[Admin] Update kuota user" })
  async updateQuota(@Param("id") id: string, @Body() dto: UpdateQuotaDto) {
    return { status: true, data: await this.svc.updateQuota(id, dto) };
  }
}
