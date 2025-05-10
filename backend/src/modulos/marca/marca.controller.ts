import { Body, Catch, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CriaMarcaDTO } from './dto/CriaMarca.dto';
import { AtualizaMarcaDTO } from './dto/AtualizaMarca.dto';
import { AutenticacaoGuard } from '../autenticacao/autenticacao.guard';
import { PreconditionFailedException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Controller('/marcas')
@Catch()
@UseGuards(AutenticacaoGuard)
export class MarcaController {
  constructor (private marcaService: MarcaService) {}

  @Post()
  public async criaMarca(@Body() dadosDaMarca: CriaMarcaDTO) {
    const marcaCriada = await this.marcaService.criaMarca(dadosDaMarca);

    return {
      marca: marcaCriada,
      mensagem: 'Marca criada com sucesso'
    }
  }

  @Get()
  public async listaMarca() {
    return await this.marcaService.listaMarca();
  }

  @Get('/:id')
  public async buscaMarcaPorId(@Param('id') id: string) {
    const marca = await this.marcaService.buscaMarcaPorId(id);

    return {
      marca,
      mensagem: 'Marca encontrada com sucesso'
    };
  }

  @Put('/:id')
  public async atualizaMarca(
    @Param('id') id: string,
    @Body() novosDados: AtualizaMarcaDTO
  ) {
    const marcaAtualizada = await this.marcaService.atualizaMarca(
      id,
      novosDados
    );

    return {
      marca: marcaAtualizada,
      mensagem: 'Marca atualizada com sucesso'
    }
  }

  @Delete('/:id')
  public async removeMarca(@Param('id') id: string) {
    try {
      const marcaRemovida = await this.marcaService.removeMarca(id);
      return {
        marca: marcaRemovida,
        mensagem: 'Marca removida com sucesso'
      };
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('violates foreign key constraint')
      ) {
        throw new PreconditionFailedException(
          'Não é possível excluir esta marca porque há veículos associados a ela.'
        );
      }
  
      throw error;
    }
  }
}