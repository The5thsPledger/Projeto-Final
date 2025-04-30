import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { UsuarioModule } from './modulos/usuario/usuario.module';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { VeiculoModule } from './modulos/veiculo/veiculo.module';
import { MarcaModule } from './modulos/marca/marca.module';
import { AutenticacaoModule } from './modulos/autenticacao/autenticacao.module';

@Module({
  imports: [
    AutenticacaoModule,
    MarcaModule,
    UsuarioModule,
    VeiculoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            createKeyv(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`),
            new Keyv({ store: new CacheableMemory({ lruSize: 5000 }) }),
          ],
          ttl: 1 * 1000 * 60,
          isGlobal: true
        }
      }
    })
  ],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor
  }]
})
export class AppModule {}