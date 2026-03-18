import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduledEventDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiProperty() @IsString() @IsNotEmpty() title: string;
  @ApiProperty() @IsDateString() startTime: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional({ default: 'auto' })
  @IsOptional()
  @IsString()
  sessionId?: string = 'auto';
}
