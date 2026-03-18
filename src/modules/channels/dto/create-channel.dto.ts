import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
