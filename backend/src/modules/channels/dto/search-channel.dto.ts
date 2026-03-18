import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchChannelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  query: string;
}
