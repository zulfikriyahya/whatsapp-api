import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileWaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  displayName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;
}
