import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportContactsDto {
  @ApiProperty({ description: 'Raw CSV string with headers: name,number,tag' })
  @IsString()
  @IsNotEmpty()
  csvData: string;
}
