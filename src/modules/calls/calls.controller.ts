import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CallsService } from "./calls.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

class CreateCallLinkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}

@ApiTags("Calls")
@UseGuards(JwtAuthGuard)
@Controller({ path: "calls", version: "1" })
export class CallsController {
  constructor(private svc: CallsService) {}

  @Get()
  @ApiOperation({ summary: "Log panggilan masuk" })
  async findAll(@CurrentUser() u: any, @Query() dto: PaginationDto) {
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

  // FIX: endpoint buat call link
  @Post("link")
  @ApiOperation({ summary: "Buat call link untuk dibagikan" })
  async createCallLink(@CurrentUser() u: any, @Body() dto: CreateCallLinkDto) {
    return {
      status: true,
      data: await this.svc.createCallLink(u.id, dto.sessionId),
    };
  }
}
