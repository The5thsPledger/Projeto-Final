import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcaEntity } from './marca.entity';
import { MarcaController } from './marca.controller';
import { MarcaService } from './marca.service';

@Module({
  imports: [TypeOrmModule.forFeature([MarcaEntity])],
  controllers: [MarcaController],
  providers: [MarcaService]
})
export class MarcaModule {}
