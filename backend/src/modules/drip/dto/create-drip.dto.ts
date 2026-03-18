import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DripStepDto } from "./drip-step.dto";

export class CreateDripDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  triggerTag: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ type: [DripStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DripStepDto)
  steps: DripStepDto[];
}
