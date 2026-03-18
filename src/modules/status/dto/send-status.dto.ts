import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum StatusType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

export class SendStatusDto {
  @ApiProperty({ enum: StatusType })
  @IsEnum(StatusType)
  type: StatusType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  font?: string;
}
