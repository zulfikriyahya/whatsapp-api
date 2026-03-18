import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SwitchSessionDto {
  @ApiProperty() @IsString() @IsNotEmpty() sessionId: string;
}
