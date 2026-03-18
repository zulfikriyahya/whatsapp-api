import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ToggleAutoReplyDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
