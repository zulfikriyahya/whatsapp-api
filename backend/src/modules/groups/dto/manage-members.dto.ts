import { IsArray, ArrayMinSize, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ManageMembersDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  participants: string[];
}
