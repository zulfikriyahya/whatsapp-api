import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MuteChatDto {
  @ApiPropertyOptional({
    description: 'Duration in seconds. Omit for indefinite mute.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;
}
