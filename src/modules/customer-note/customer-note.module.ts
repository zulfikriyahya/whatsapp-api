import { Module } from '@nestjs/common';
import { CustomerNoteController } from './customer-note.controller';
import { CustomerNoteService } from './customer-note.service';

@Module({
  controllers: [CustomerNoteController],
  providers: [CustomerNoteService],
})
export class CustomerNoteModule {}
