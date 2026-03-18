import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum WorkspaceMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export class UpdateMemberPermissionDto {
  @ApiPropertyOptional({ enum: WorkspaceMemberRole })
  @IsOptional()
  @IsEnum(WorkspaceMemberRole)
  role?: WorkspaceMemberRole;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  permissions?: Record<string, boolean>;
}
