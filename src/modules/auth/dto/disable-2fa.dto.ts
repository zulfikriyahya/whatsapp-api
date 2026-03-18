export class Disable2faDto {
  @ApiProperty() @IsString() @Length(6, 6) code: string;
}
