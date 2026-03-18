import { IsOptional, IsInt, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateQuotaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  messagesSentToday?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  broadcastsThisMonth?: number;
}
