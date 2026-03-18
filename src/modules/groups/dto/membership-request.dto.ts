import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MembershipRequestAction {
  APPROVE = 'approve',
  REJECT = 'reject',
}

export class MembershipRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requesterJid: string;

  @ApiProperty({ enum: MembershipRequestAction })
  @IsEnum(MembershipRequestAction)
  action: MembershipRequestAction;
}
