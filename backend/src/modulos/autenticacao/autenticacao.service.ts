import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

export interface UsuarioPayload {
  sub: string;
  nomeUsuario: string;
}

@Injectable()
export class AutenticacaoService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService
  ) {}

  async login(email: string, senhaInserida: string) {
    try {
      const usuario = await this.usuarioService.buscaPorEmail(email);

      const usuarioFoiAutenticado = await bcryptjs.compare(
        senhaInserida,
        usuario!.senha
      );

      if (!usuarioFoiAutenticado) {
        throw new UnauthorizedException('O email ou a senha está incorreto');
      }

      const payload: UsuarioPayload = {
        sub: usuario!.id, // subject
        nomeUsuario: usuario!.nome
      };

      return {
        tokenAcesso: await this.jwtService.signAsync(payload)
      };
    } catch (erro) {
      if (erro instanceof NotFoundException) {
        throw new UnauthorizedException('O email ou a senha está incorreto');
      }

      throw erro;
    }
  }
}
