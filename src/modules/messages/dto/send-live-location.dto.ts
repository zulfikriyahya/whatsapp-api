import {
  IsNumber,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendLiveLocationDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiProperty() @IsNumber() latitude: number;
  @ApiProperty() @IsNumber() longitude: number;
  @ApiPropertyOptional({ description: 'Duration in seconds, default 60' })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number = 60;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ default: 'auto' })
  @IsOptional()
  @IsString()
  sessionId?: string = 'auto';
}
