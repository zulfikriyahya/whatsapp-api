import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ToggleWorkflowDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
