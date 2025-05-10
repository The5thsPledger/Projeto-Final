import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { Repository } from 'typeorm';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { isUUID } from 'class-validator';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>
  ) {}

  public async criaUsuario(dadosDoUsuario: CriaUsuarioDTO) {
    const usuarioEntity: UsuarioEntity = new UsuarioEntity();

    Object.assign(usuarioEntity, dadosDoUsuario as UsuarioEntity);

    await this.usuarioRepository.save(usuarioEntity);

    return usuarioEntity;
  }

  public async listaUsuario() {
    const usuariosSalvos = await this.usuarioRepository.find();
    const usuariosLista = usuariosSalvos.map(
      (usuario) => new ListaUsuarioDTO(usuario.id, usuario.nome, usuario.email)
    );

    return usuariosLista;
  }

  public async buscaPorId(id: string) {
    if (!isUUID(id)) {
      throw new NotFoundException('Usuário não existe');
    }

    const possivelUsuario = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!possivelUsuario) {
      throw new NotFoundException('Usuário não existe');
    }

    return possivelUsuario;
  }

  public async atualizaUsuario(id: string, novosDados: AtualizaUsuarioDTO) {
    await this.usuarioRepository.update(id, novosDados);
    const usuario = await this.buscaPorId(id);
    return new ListaUsuarioDTO(usuario.id, usuario.nome, usuario.email);
        
  }

  public async removeUsuario(id: string) {
    const usuario = await this.buscaPorId(id);
    const usuarioExcluido: ListaUsuarioDTO = new ListaUsuarioDTO(id, usuario.nome, usuario.email);
    await this.usuarioRepository.delete(id);
    return usuarioExcluido;
  }

  public async existeComEmail(email: string) {
    const possiveisUsuarios = await this.usuarioRepository.find({
      where: {
        email: email
      }
    });

    return possiveisUsuarios.length > 0;
  }

  public async buscaPorEmail(emailBusca: string) {
    const possivelUsuario = await this.usuarioRepository.findOneBy({ email: emailBusca });

    if (!possivelUsuario) {
      throw new NotFoundException('Email não existe');
    }

    return possivelUsuario;
  }
}
