import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTemplateDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsString() @IsNotEmpty() content: string;
  @ApiPropertyOptional({ default: "General" })
  @IsOptional()
  @IsString()
  category?: string;
}
