import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignLabelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  labelId: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  chatIds: string[];
}
