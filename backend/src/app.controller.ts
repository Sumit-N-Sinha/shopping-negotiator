import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('search')
  async search(@Body() body: { query: string; mode?: string; category?: string }) {
    return this.appService.search(body);
  }
}
