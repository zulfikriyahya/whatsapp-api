export class Enable2faDto {
  @ApiProperty() @IsString() @Length(6, 6) code: string;
}
