import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() geminiApiKey?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  geminiConfidenceThreshold?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoDownloadPhotos?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoDownloadVideos?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoDownloadAudio?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoDownloadDocuments?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() backgroundSync?: boolean;
}
