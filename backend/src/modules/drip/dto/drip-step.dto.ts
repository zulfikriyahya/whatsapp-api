import { IsInt, IsString, Matches, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class DripStepDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  dayOffset: number;

  @ApiProperty({ example: "09:00" })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: "timeAt must be HH:MM format",
  })
  timeAt: string;

  @ApiProperty()
  @IsString()
  message: string;
}
