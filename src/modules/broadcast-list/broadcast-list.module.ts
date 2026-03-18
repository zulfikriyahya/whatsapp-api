import { Module } from '@nestjs/common';
import { BroadcastListController } from './broadcast-list.controller';
import { BroadcastListService } from './broadcast-list.service';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [BroadcastListController],
  providers: [BroadcastListService],
})
export class BroadcastListModule {}
