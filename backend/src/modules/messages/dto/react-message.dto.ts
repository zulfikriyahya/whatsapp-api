import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReactMessageDto {
  @ApiProperty({
    description: 'Emoji reaction. Empty string to remove reaction.',
  })
  @IsString()
  reaction: string;
}
