import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
