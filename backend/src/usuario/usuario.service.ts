import { Injectable } from '@nestjs/common';

@Injectable()
export class UsuarioService {
  async getHello() {
    return 'Hello World!';
  }
}
