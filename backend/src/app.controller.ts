import { Body, Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('hello')
  @CacheTTL(1000 * 60 * 15)
  async getHello(){
    console.log('Cache skip');
    return this.appService.getHello();
  }
}
