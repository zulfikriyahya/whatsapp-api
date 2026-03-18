import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CustomerNoteService } from "./customer-note.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UpsertNoteDto } from "./dto/upsert-note.dto";

@ApiTags("Customer Note")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("customer_note")
@Controller({ path: "contacts/:contactId/note", version: "1" })
export class CustomerNoteController {
  constructor(private svc: CustomerNoteService) {}

  @Get()
  async getNote(@CurrentUser() u: any, @Param("contactId") cid: string) {
    return { status: true, data: await this.svc.getNote(u.id, cid) };
  }
  @Put()
  async upsertNote(
    @CurrentUser() u: any,
    @Param("contactId") cid: string,
    @Body() dto: UpsertNoteDto,
  ) {
    return {
      status: true,
      data: await this.svc.upsertNote(u.id, cid, dto.content),
    };
  }
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteNote(@CurrentUser() u: any, @Param("contactId") cid: string) {
    return { status: true, data: await this.svc.deleteNote(u.id, cid) };
  }
}
