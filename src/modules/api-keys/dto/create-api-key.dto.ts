import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateApiKeyDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;

  @ApiPropertyOptional({ description: "IP whitelist, comma-separated CIDR" })
  @IsOptional()
  @IsString()
  ipWhitelist?: string;

  @ApiPropertyOptional({
    description: "Sandbox mode: request tidak dikirim ke WhatsApp sungguhan",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isSandbox?: boolean;

  @ApiPropertyOptional({
    description: "Tanggal kadaluarsa token (ISO 8601). Null = tidak expired.",
    example: "2026-12-31T23:59:59.000Z",
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
