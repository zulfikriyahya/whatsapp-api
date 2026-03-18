import { IsString, IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Verify2faDto {
  @ApiProperty() @IsString() @IsNotEmpty() tempToken: string;
  @ApiProperty() @IsString() @Length(6, 6) code: string;
}
