import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsObject,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { WorkflowNodeDto } from "./workflow-node.dto";

export class TriggerConditionDto {
  @IsString()
  keyword: string;

  @IsString()
  matchType: string;
}

export class CreateWorkflowDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => TriggerConditionDto)
  triggerCondition: TriggerConditionDto;

  @ApiProperty({ type: [WorkflowNodeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowNodeDto)
  nodes: WorkflowNodeDto[];
}
