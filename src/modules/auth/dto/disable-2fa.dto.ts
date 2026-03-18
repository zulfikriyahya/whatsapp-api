import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Disable2faDto {
  @ApiProperty({
    description: "Kode TOTP 6 digit atau backup code (format: XXXXX-XXXXX)",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
