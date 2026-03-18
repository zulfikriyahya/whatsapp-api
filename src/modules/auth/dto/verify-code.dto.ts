import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO reusable untuk semua operasi yang membutuhkan verifikasi kode.
 * Mendukung kode TOTP 6 digit ("123456") maupun backup code ("XXXXX-XXXXX").
 */
export class VerifyCodeDto {
  @ApiProperty({
    description: "Kode TOTP 6 digit atau backup code (format: XXXXX-XXXXX)",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
