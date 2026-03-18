import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { InboxService } from "./inbox.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { QuotaGuard } from "../../common/guards/quota.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { QueryInboxDto } from "./dto/query-inbox.dto";

class ReplyInboxDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: "Quote pesan yang dibalas" })
  @IsOptional()
  @IsString()
  quotedMessageId?: string;
}

@ApiTags("Inbox")
@UseGuards(JwtAuthGuard)
@Controller({ path: "inbox", version: "1" })
export class InboxController {
  constructor(private inbox: InboxService) {}

  @Get()
  @ApiOperation({ summary: "Daftar pesan masuk" })
  async findAll(@CurrentUser() u: any, @Query() dto: QueryInboxDto) {
    const r = await this.inbox.findAll(u.id, dto);
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

  @Get("conversations")
  @ApiOperation({ summary: "Daftar percakapan grouped by JID" })
  async conversations(@CurrentUser() u: any) {
    return { status: true, data: await this.inbox.getConversations(u.id) };
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Tandai pesan sebagai dibaca" })
  async markRead(@CurrentUser() u: any, @Param("id") id: string) {
    await this.inbox.markRead(u.id, id);
    return { status: true };
  }

  @Patch("conversations/:jid/read-all")
  @ApiOperation({ summary: "Tandai semua pesan percakapan sebagai dibaca" })
  async markAllRead(@CurrentUser() u: any, @Param("jid") jid: string) {
    await this.inbox.markAllRead(u.id, jid);
    return { status: true };
  }

  /**
   * FIX: Balas pesan langsung dari inbox.
   * Secara otomatis menggunakan sesi yang sama dengan pesan masuk.
   */
  @Post(":id/reply")
  @UseGuards(QuotaGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Balas pesan langsung dari inbox" })
  async reply(
    @CurrentUser() u: any,
    @Param("id") id: string,
    @Body() dto: ReplyInboxDto,
  ) {
    return {
      status: true,
      data: await this.inbox.reply(u.id, id, dto.message, dto.quotedMessageId),
    };
  }
}
