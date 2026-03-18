import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchMessagesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chatId?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
