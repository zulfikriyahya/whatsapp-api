import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendVoiceNoteDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiPropertyOptional({ default: 'auto' })
  @IsOptional()
  @IsString()
  sessionId?: string = 'auto';
}
