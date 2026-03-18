import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateSessionDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() usePairingCode?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() phoneNumber?: string;
}
