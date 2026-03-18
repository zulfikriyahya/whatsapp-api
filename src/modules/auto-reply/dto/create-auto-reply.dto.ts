import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsNotEmpty,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { MatchType } from "@prisma/client";

export class CreateAutoReplyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  response: string;

  @ApiProperty({ enum: MatchType })
  @IsEnum(MatchType)
  matchType: MatchType;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number = 0;
}
