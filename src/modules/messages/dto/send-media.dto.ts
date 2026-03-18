export class SendMediaDto {
  @ApiProperty() @IsString() @IsNotEmpty() to: string;
  @ApiPropertyOptional({ default: "auto" })
  @IsOptional()
  @IsString()
  sessionId?: string = "auto";
  @ApiPropertyOptional() @IsOptional() @IsString() caption?: string;
}
