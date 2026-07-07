import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PythonBridgeService } from './modules/python-bridge/python-bridge.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PythonBridgeService]
})
export class AppModule {}
