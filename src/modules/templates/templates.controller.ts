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
import { TemplatesService } from "./templates.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { QueryTemplatesDto } from "./dto/query-templates.dto";

@ApiTags("Templates")
@UseGuards(JwtAuthGuard)
@Controller({ path: "templates", version: "1" })
export class TemplatesController {
  constructor(private svc: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: "Daftar template pesan" })
  async findAll(@CurrentUser() u: any, @Query() dto: QueryTemplatesDto) {
    return { status: true, data: await this.svc.findAll(u.id, dto) };
  }

  @Post()
  @ApiOperation({ summary: "Buat template baru" })
  async create(@CurrentUser() u: any, @Body() dto: CreateTemplateDto) {
    return { status: true, data: await this.svc.create(u.id, dto) };
  }

  @Put(":id")
  @ApiOperation({ summary: "Update template" })
  async update(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return { status: true, data: await this.svc.update(u.id, id, dto) };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Hapus template" })
  async remove(@CurrentUser() u: any, @Param("id") id: string) {
    await this.svc.remove(u.id, id);
    return { status: true };
  }
}
