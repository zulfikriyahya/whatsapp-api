import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ChannelAdminAction {
  ADD = 'add',
  REMOVE = 'remove',
}

export class ManageChannelAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  participantJid: string;

  @ApiProperty({ enum: ChannelAdminAction })
  @IsEnum(ChannelAdminAction)
  action: ChannelAdminAction;
}
