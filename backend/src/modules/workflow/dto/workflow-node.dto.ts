import { IsString, IsEnum, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class WorkflowNodeConfigDto {
  message?: string;
  seconds?: number;
  tag?: string;
}

export class WorkflowNodeDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty({ enum: ["send_message", "delay", "add_tag"] })
  @IsEnum(["send_message", "delay", "add_tag"])
  type: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => WorkflowNodeConfigDto)
  config: WorkflowNodeConfigDto;
}
