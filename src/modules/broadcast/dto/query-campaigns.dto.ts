import { ApiPropertyOptional } from "@nestjs/swagger";
import { CampaignStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QueryCampaignsDto extends PaginationDto {
  @ApiPropertyOptional({ enum: CampaignStatus })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}
