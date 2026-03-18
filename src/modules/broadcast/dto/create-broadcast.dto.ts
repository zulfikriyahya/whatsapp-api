import { IsString, IsNotEmpty, IsOptional, IsArray } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateBroadcastDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() message: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() recipients?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() csvData?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() filterTag?: string;
}
