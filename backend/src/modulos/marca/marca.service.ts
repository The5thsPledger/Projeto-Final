import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarcaEntity } from './marca.entity';
import { Repository } from 'typeorm';
import { CriaMarcaDTO } from './dto/CriaMarca.dto';
import { isUUID } from 'class-validator';
import { AtualizaMarcaDTO } from './dto/AtualizaMarca.dto';

@Injectable()
export class MarcaService {
  constructor(
    @InjectRepository(MarcaEntity)
    private readonly marcaRepository: Repository<MarcaEntity>
  ) {}

  public async criaMarca(dadosDaMarca: CriaMarcaDTO) {
    const marcaEntity: MarcaEntity = new MarcaEntity();

    Object.assign(marcaEntity, dadosDaMarca as MarcaEntity);

    await this.marcaRepository.save(marcaEntity);

    return marcaEntity;
  }

  public async listaMarca() {
    return await this.marcaRepository.find();
  }

  private async buscaPorId(id: string) {
    if (!isUUID(id)) {
      throw new NotFoundException('Marca não existe');
    }

    const possivelMarca = await this.marcaRepository.findOne({
      where: { id }
    });

    if (!possivelMarca) {
      throw new NotFoundException('Marca não existe');
    }

    return possivelMarca;
  }

  public async atualizaMarca(id: string, novosDados: AtualizaMarcaDTO) {
    if (!isUUID(id)) {
      throw new NotFoundException('Marca não existe');
    }
    await this.marcaRepository.update(id, novosDados);
    return await this.buscaPorId(id);
  }

  public async removeMarca(id: string) {
    const marcaExcluida = await this.buscaPorId(id);
    await this.marcaRepository.delete(id);
    return marcaExcluida;
  }
}
