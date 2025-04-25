import { Inject, Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Module({
    controllers: [UsuarioController],
    providers: [UsuarioService],
})
export class UsuarioModule {}