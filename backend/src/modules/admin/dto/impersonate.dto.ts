import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ImpersonateDto {
  @ApiProperty({ description: "ID user yang akan di-impersonate" })
  @IsUUID()
  userId: string;
}
