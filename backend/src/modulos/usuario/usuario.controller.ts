import { Body, Catch, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { HashearSenhaPipe } from '../../recursos/pipes/hashear-senha.pipe';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { AutenticacaoGuard } from '../autenticacao/autenticacao.guard';

@Controller('/usuarios')
@Catch()
//@UseGuards(AutenticacaoGuard)
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Post()
  public async criaUsuario(
    @Body() { senha, ...dadosDoUsuario }: CriaUsuarioDTO,
    @Body('senha', HashearSenhaPipe) senhaHasheada: string
  ) {
    const usuarioCriado = await this.usuarioService.criaUsuario({
      ...dadosDoUsuario,
      senha: senhaHasheada
    });

    return {
      usario: new ListaUsuarioDTO(usuarioCriado.id, usuarioCriado.nome),
      mensagem: 'Usuário criado com sucesso'
    };
  }

  @Get()
  public async listaUsuario() {
    return await this.usuarioService.listaUsuario();
  }

  @Put('/:id')
  public async atualizaUsuario(
    @Param('id') id: string,
    @Body() novosDados: AtualizaUsuarioDTO
  ) {
    const usuarioAtualizado = await this.usuarioService.atualizaUsuario(
      id,
      novosDados
    );

    return {
      usuario: usuarioAtualizado,
      mensagem: 'Usuário atualizado com sucesso'
    };
  }

  @Delete('/:id')
  public async removeUsuario(@Param('id') id: string) {
    const usuarioRemovido = await this.usuarioService.removeUsuario(id);

    return {
      usuario: usuarioRemovido,
      mensagem: 'Usuário removido com sucesso'
    };
  }

  catch(excecao: unknown) {
    console.error(excecao);
  }
}