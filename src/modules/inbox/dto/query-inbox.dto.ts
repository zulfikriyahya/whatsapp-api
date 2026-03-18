import { IsOptional, IsString, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export class QueryInboxDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  unread?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jid?: string;
}
