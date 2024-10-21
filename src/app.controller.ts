import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("dummy")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('endpoint1')
  async endpoint1(): Promise<string> {
    await this.simulateDelay(1000); // Simulate 1s delay
    return 'This is endpoint 1';
  }

  @Get('endpoint2')
  async endpoint2(): Promise<string> {
    await this.simulateDelay(500); // Simulate 0.5s delay
    return 'This is endpoint 2';
  }

  @Get('endpoint3')
  async endpoint3(): Promise<string> {
    await this.simulateDelay(2000); // Simulate 2s delay
    return 'This is endpoint 3';
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
