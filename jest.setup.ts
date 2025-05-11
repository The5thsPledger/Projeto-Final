import * as dotenv from 'dotenv';
import { UsuarioEntity } from 'backend/src/modulos/usuario/usuario.entity';
import { HashearSenhaPipe } from 'backend/src/recursos/pipes/hashear-senha.pipe';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { AtualizaUsuarioDTO } from 'backend/src/modulos/usuario/dto/AtualizaUsuario.dto';

dotenv.config({path: './backend/.env'});

export const senhaTeste = '12345678';
export const mockUsuarioRepoditory = {
    find: jest.fn().mockImplementation(async (options?) => {
        if (options) {
            return [];
        }
        const usuario = new UsuarioEntity();
        usuario.id = uuidv4();
        usuario.nome = 'Usuario Teste';
        usuario.email = 'teste@jest.com';
        usuario.senha = await new HashearSenhaPipe(
            new ConfigService()
        ).transform(senhaTeste);
        return [usuario];
    }),
    findOne: jest.fn().mockImplementation(async (id: string) => {
        const usuario = new UsuarioEntity();
        usuario.id = id;
        usuario.nome = 'Usuario Teste';
        usuario.email = 'teste@jest.com';
        usuario.senha = await new HashearSenhaPipe(
            new ConfigService()
        ).transform(senhaTeste);
        return usuario;
    }),
    findOneBy: jest.fn().mockImplementation(async (email: string) => {
        const usuario = new UsuarioEntity();
        usuario.id = uuidv4();
        usuario.nome = 'Usuario Teste';
        usuario.email = email;
        usuario.senha = await new HashearSenhaPipe(
        new ConfigService()
        ).transform(senhaTeste);
        return usuario;
    }),
    save: jest.fn().mockImplementation(async (usuario: UsuarioEntity) => {
        const usuarioSalvo = new UsuarioEntity();
        usuarioSalvo.id = usuario.id;
        usuarioSalvo.nome = usuario.nome;
        usuarioSalvo.email = usuario.email;
        usuarioSalvo.senha = await new HashearSenhaPipe(
            new ConfigService()
        ).transform(usuario.senha);
        return usuarioSalvo;
    }),
    update: jest.fn().mockImplementation(async (id: string, novosDados: AtualizaUsuarioDTO) => {
        const usuarioAtualizado: Partial<UsuarioEntity> = new UsuarioEntity();
        usuarioAtualizado.id = id;
        usuarioAtualizado.nome = novosDados.nome;
        usuarioAtualizado.email = novosDados.email;
        usuarioAtualizado.senha = novosDados.senha;
        return usuarioAtualizado;
    }),
    delete: jest.fn().mockImplementation(async (id: string) => {
        const usuarioExcluido = new UsuarioEntity();
        usuarioExcluido.id = id;
        usuarioExcluido.nome = 'Usuario Teste';
        return usuarioExcluido;
    })
}