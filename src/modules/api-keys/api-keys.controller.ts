import {
  Controller,
  Get,
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
import { ApiKeysService } from "./api-keys.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateApiKeyDto } from "./dto/create-api-key.dto";

@ApiTags("API Keys")
@UseGuards(JwtAuthGuard)
@Controller({ path: "keys", version: "1" })
export class ApiKeysController {
  constructor(private svc: ApiKeysService) {}

  @Get()
  @ApiOperation({ summary: "Daftar API token" })
  async findAll(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.findAll(u.id) };
  }

  @Post()
  @ApiOperation({ summary: "Generate API token baru" })
  async create(
    @CurrentUser() u: any,
    @Body() dto: CreateApiKeyDto,
    @Req() req: Request,
  ) {
    return {
      status: true,
      data: await this.svc.create(
        u.id,
        u.email,
        dto,
        req.ip,
        req.headers["user-agent"],
      ),
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus API token" })
  async remove(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Req() req: Request,
  ) {
    await this.svc.remove(u.id, u.email, id, req.ip, req.headers["user-agent"]);
    return { status: true };
  }
}
