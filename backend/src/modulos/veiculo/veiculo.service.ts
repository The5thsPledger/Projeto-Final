import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VeiculoEntity } from './veiculo.entity';
import { Repository } from 'typeorm';
import { CriaVeiculoDTO } from './dto/CriaVeiculo.dto';
import { isUUID } from 'class-validator';
import { AtualizaVeiculoDTO } from './dto/AtualizaVeiculo.dto';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(VeiculoEntity)
    private readonly veiculoRepository: Repository<VeiculoEntity>
  ) {}

  public async criaVeiculo(dadosDoVeiculo: CriaVeiculoDTO) {
    const veiculoEntity: VeiculoEntity = new VeiculoEntity();

    Object.assign(veiculoEntity, dadosDoVeiculo as VeiculoEntity);

    await this.veiculoRepository.save(veiculoEntity);

    return veiculoEntity;
  }

  public async listaVeiculo() {
    return await this.veiculoRepository.find();
  }

  public async buscaPorId(id: string) {
    if (!isUUID(id)) {
      throw new NotFoundException('Veiculo não existe');
    }

    const possivelVeiculo = await this.veiculoRepository.findOne({
      where: {id}
    });

    if (!possivelVeiculo) {
      throw new NotFoundException('Veiculo não existe');
    }

    return possivelVeiculo;
  }

  public async atualizaVeiculo(id: string, novosDados: AtualizaVeiculoDTO) {
    if (!isUUID(id)) {
      throw new NotFoundException('Veiculo não existe');
    }
    await this.veiculoRepository.update(id, novosDados);
    return await this.buscaPorId(id);
  }

  public async removeVeiculo(id: string) {
    const veiculoExcluido = this.buscaPorId(id);
    await this.veiculoRepository.delete(id);
    return veiculoExcluido;
  }

  public async listaPorFiltro(idMarca?: string, min?: number, max?: number) {
    const query = this.veiculoRepository.createQueryBuilder('veiculos')
      .innerJoinAndSelect('veiculos.marca', 'marcas');

    if (idMarca) {
      query.andWhere('veiculos.marcaId = :idMarca', { idMarca: idMarca });
    }

    if (min) {
      query.andWhere('veiculos.valor >= :min', { min: min });
    }

    if (max) {
      query.andWhere('veiculos.valor <= :max', { max: max });
    }

    return query.getMany();
  }
}