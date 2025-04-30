import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeiculoEntity } from './veiculo.entity';
import { VeiculoController } from './veiculo.controller';
import { VeiculoService } from './veiculo.service';

@Module({
  imports: [TypeOrmModule.forFeature([VeiculoEntity])],
  controllers: [VeiculoController],
  providers: [VeiculoService]
})
export class VeiculoModule {}
