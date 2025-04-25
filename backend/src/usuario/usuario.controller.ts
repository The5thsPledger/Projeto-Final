import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly appService: UsuarioService) {}

  @Get()
  async getHello(){
    console.log('Cache skip');
    return await this.appService.getHello();
  }
}
