import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTierDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsInt() @Min(1) maxSessions: number;
  @ApiProperty() @IsInt() @Min(1) maxApiKeys: number;
  @ApiProperty() @IsInt() @Min(1) maxDailyMessages: number;
  @ApiProperty() @IsInt() @Min(0) maxMonthlyBroadcasts: number;
  @ApiProperty() @IsArray() features: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
