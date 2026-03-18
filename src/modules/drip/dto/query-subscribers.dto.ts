import { IsOptional, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { DripSubscriptionStatus } from "@prisma/client";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QuerySubscribersDto extends PaginationDto {
  @ApiPropertyOptional({ enum: DripSubscriptionStatus })
  @IsOptional()
  @IsEnum(DripSubscriptionStatus)
  status?: DripSubscriptionStatus;
}
