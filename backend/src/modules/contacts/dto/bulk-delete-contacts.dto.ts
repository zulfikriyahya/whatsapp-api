import { IsOptional, IsArray, IsBoolean, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class BulkDeleteContactsDto {
  @ApiPropertyOptional() @IsOptional() @IsArray() ids?: string[];
  @ApiPropertyOptional() @IsOptional() @IsBoolean() selectAll?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() filterTag?: string;
}
