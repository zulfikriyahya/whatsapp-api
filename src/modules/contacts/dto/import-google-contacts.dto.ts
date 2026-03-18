import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportGoogleContactsDto {
  @ApiProperty({ description: 'Google OAuth access token' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
