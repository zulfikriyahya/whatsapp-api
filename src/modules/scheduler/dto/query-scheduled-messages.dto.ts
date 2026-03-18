import { IsOptional, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { ScheduledMessageStatus } from "@prisma/client";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QueryScheduledMessagesDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ScheduledMessageStatus })
  @IsOptional()
  @IsEnum(ScheduledMessageStatus)
  status?: ScheduledMessageStatus;
}
