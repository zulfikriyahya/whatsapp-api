import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { WebhookService } from "./webhook.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import {
  TierFeatureGuard,
  RequireFeature,
} from "../../common/guards/tier-feature.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UpdateWebhookDto } from "./dto/update-webhook.dto";

@ApiTags("Webhook")
@UseGuards(JwtAuthGuard, TierFeatureGuard)
@RequireFeature("webhook")
@Controller({ path: "webhooks", version: "1" })
export class WebhookController {
  constructor(private svc: WebhookService) {}

  @Get("config")
  async getConfig(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.getConfig(u.id) };
  }
  @Put("config")
  async updateConfig(@CurrentUser() u: any, @Body() dto: UpdateWebhookDto) {
    return { status: true, data: await this.svc.updateConfig(u.id, dto) };
  }
  @Post("generate-secret")
  @HttpCode(HttpStatus.OK)
  async generateSecret(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.generateSecret(u.id) };
  }
  @Post("test")
  @HttpCode(HttpStatus.OK)
  async test(@CurrentUser() u: any) {
    return { status: true, data: await this.svc.testWebhook(u.id) };
  }
}
