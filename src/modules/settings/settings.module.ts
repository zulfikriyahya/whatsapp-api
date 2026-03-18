import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { AiModule } from '../ai/ai.module';
import { GatewayModule } from '../../gateway/gateway.module';

@Module({
  imports: [AiModule, GatewayModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
