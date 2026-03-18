import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendContactDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({
    type: [String],
    description: 'Phone numbers of contacts to send as vCard',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  contacts: string[];

  @ApiPropertyOptional({ default: 'auto' })
  @IsOptional()
  @IsString()
  sessionId?: string = 'auto';
}
