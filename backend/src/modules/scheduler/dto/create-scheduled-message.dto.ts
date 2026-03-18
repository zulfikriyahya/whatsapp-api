import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RecurrenceType } from "@prisma/client";

export class CreateScheduledMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  target: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty()
  @IsDateString()
  scheduledTime: string;

  @ApiPropertyOptional({ enum: RecurrenceType, default: RecurrenceType.none })
  @IsOptional()
  @IsEnum(RecurrenceType)
  recurrenceType?: RecurrenceType;
}
