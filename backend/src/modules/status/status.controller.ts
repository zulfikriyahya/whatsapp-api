import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { StatusService } from "./status.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("Status")
@UseGuards(JwtAuthGuard)
@Controller({ path: "status", version: "1" })
export class StatusController {
  constructor(private svc: StatusService) {}

  @Post(":sessionId/bio")
  @HttpCode(HttpStatus.OK)
  async setStatus(
    @Param("sessionId") sid: string,
    @Body() body: { status: string },
  ) {
    return { status: true, data: await this.svc.setStatus(sid, body.status) };
  }

  @Post(":sessionId/send")
  async sendStatus(
    @Param("sessionId") sid: string,
    @Body() body: { text: string },
  ) {
    return {
      status: true,
      data: await this.svc.sendTextStatus(sid, body.text),
    };
  }

  @Post(":sessionId/presence")
  @HttpCode(HttpStatus.OK)
  async setPresence(
    @Param("sessionId") sid: string,
    @Body() body: { available: boolean },
  ) {
    return {
      status: true,
      data: await this.svc.setPresence(sid, body.available),
    };
  }
}
