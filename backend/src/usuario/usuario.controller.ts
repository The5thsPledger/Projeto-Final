import { Controller, Get, UseInterceptors, CacheTTL } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly appService: UsuarioService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(1000 * 60 * 15)
  async getHello(){
    console.log('Cache skip');
    return await this.appService.getHello();
  }
}
