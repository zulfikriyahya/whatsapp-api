import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EventResponse {
  ACCEPT = 'accept',
  DECLINE = 'decline',
}

export class RespondEventDto {
  @ApiProperty() @IsString() @IsNotEmpty() messageId: string;
  @ApiProperty({ enum: EventResponse })
  @IsEnum(EventResponse)
  response: EventResponse;
  @ApiProperty() @IsString() @IsNotEmpty() sessionId: string;
}
