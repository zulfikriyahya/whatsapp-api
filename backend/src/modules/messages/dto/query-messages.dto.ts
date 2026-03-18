import { ApiPropertyOptional } from "@nestjs/swagger";
import { MessageStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QueryMessagesDto extends PaginationDto {
  @ApiPropertyOptional({ enum: MessageStatus })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() sessionId?: string;
}
