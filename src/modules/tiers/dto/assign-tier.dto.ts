import { IsString, IsOptional, IsDateString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AssignTierDto {
  @ApiProperty() @IsString() userId: string;
  @ApiProperty() @IsString() tierId: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiresAt?: string;
}
