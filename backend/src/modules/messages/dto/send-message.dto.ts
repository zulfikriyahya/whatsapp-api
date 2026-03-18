import { IsString, IsNotEmpty, IsOptional, IsArray } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SendMessageDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiProperty() @IsString() @IsNotEmpty() message: string;
  @ApiPropertyOptional({ default: "auto" })
  @IsOptional()
  @IsString()
  sessionId?: string = "auto";
  @ApiPropertyOptional() @IsOptional() @IsString() quotedMessageId?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() mentions?: string[];
}
