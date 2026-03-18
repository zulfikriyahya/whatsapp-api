import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
  ArrayMinSize,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SendPollDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiProperty() @IsString() @IsNotEmpty() question: string;
  @ApiProperty() @IsArray() @ArrayMinSize(2) options: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() multiselect?: boolean;
  @ApiPropertyOptional({ default: "auto" })
  @IsOptional()
  @IsString()
  sessionId?: string = "auto";
}
