import { Module } from '@nestjs/common';
import { ScheduledEventController } from './scheduled-event.controller';
import { ScheduledEventService } from './scheduled-event.service';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [ScheduledEventController],
  providers: [ScheduledEventService],
})
export class ScheduledEventModule {}
