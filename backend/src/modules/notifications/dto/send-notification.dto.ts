import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NotificationType {
  EMAIL = 'email',
  SOCKET = 'socket',
  BOTH = 'both',
}

export class SendNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    enum: NotificationType,
    default: NotificationType.SOCKET,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType = NotificationType.SOCKET;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subject?: string;
}
