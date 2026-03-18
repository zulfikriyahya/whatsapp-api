import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { InboxService } from "./inbox.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { QueryInboxDto } from "./dto/query-inbox.dto";

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
  @ApiOperation({ summary: "Daftar percakapan (grouped by JID)" })
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
}
