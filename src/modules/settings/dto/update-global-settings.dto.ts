import { IsOptional, IsInt, Min } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateGlobalSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultDailyMessageLimit?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  defaultMonthlyBroadcastLimit?: number;
}
