import { Injectable } from '@nestjs/common';
import { PythonBridgeService } from './modules/python-bridge/python-bridge.service';

@Injectable()
export class AppService {
  constructor(private readonly pythonBridge: PythonBridgeService) {}

  getHello(): string {
    return 'Shopping Negotiator API is running';
  }

  async search(payload: { query: string; mode?: string; category?: string }) {
    return this.pythonBridge.runSearch(payload);
  }
}
