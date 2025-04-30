import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VeiculoEntity } from './veiculo.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CriaVeiculoDTO } from './dto/CriaVeiculo.dto';
import { isNumber, isUUID } from 'class-validator';
import { AtualizaVeiculoDTO } from './dto/AtualizaVeiculo.dto';
import { MarcaEntity } from '../marca/marca.entity';

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

  private async buscaPorId(id: string) {
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
    if (idMarca && min && max) {
      return this.veiculoRepository.find({
        relations: { 
          marca: true
        },
        where: {
          marca: {
            id: idMarca
          },
          valor: Between(min, max)
        },
        order: {
          modelo: 'ASC'
        }
      });
    }
    else if (idMarca && min && !max) {
      return this.veiculoRepository.find({
        relations: { 
          marca: true
        },
        where: {
          marca: {
            id: idMarca
          },
          valor: MoreThanOrEqual(min)
        },
        order: {
          modelo: 'ASC'
        }
      });
    }
    else if (idMarca && !min && max) {
      return this.veiculoRepository.find({
        relations: { 
          marca: true
        },
        where: {
          marca: {
            id: idMarca
          },
          valor: LessThanOrEqual(max)
        },
        order: {
          modelo: 'ASC'
        }
      });
    }
    else if (idMarca && !min && !max) {
      return this.veiculoRepository.find({
        relations: { 
          marca: true
        },
        where: {
          marca: {
            id: idMarca
          }
        },
        order: {
          modelo: 'ASC'
        }
      });
    }
    else if (!idMarca && min && max) {
      return this.veiculoRepository.find({
        relations: { 
          marca: true
        },
        where: {
          valor: Between(min, max)
        },
        order: {
          modelo: 'ASC'
        }
      });
    }
    else if (!idMarca && min && !max) {
      return this.veiculoRepository.find({
        relations: { 
          marca: true
        },
        where: {
          valor: MoreThanOrEqual(min)
        },
        order: {
          modelo: 'ASC'
        }
      });
    }
    else if (!idMarca && !min && max) {
      return this.veiculoRepository.find({
        relations: { 
          marca: true
        },
        where: {
          valor: LessThanOrEqual(max)
        },
        order: {
          modelo: 'ASC'
        }
      });
    }
  }
}