import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/postgres.config.service';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [
    UsuarioModule,
    
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 5 * 1000 * 60,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
