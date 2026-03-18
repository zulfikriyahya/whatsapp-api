import { IsNumber, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SendLocationDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiProperty() @IsNumber() latitude: number;
  @ApiProperty() @IsNumber() longitude: number;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ default: "auto" })
  @IsOptional()
  @IsString()
  sessionId?: string = "auto";
}
