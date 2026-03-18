import { IsOptional, IsString, IsUrl, IsBoolean } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateWebhookDto {
  @ApiPropertyOptional() @IsOptional() @IsUrl() webhookUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
