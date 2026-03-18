import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ToggleDripDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
