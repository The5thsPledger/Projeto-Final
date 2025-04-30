import { Body, Catch, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { VeiculoService } from './veiculo.service';
import { CriaVeiculoDTO } from './dto/CriaVeiculo.dto';
import { AtualizaVeiculoDTO } from './dto/AtualizaVeiculo.dto';
import { AutenticacaoGuard } from '../autenticacao/autenticacao.guard';

@Controller('/veiculos')
@Catch()
export class VeiculoController {
  constructor(private veiculoService: VeiculoService) {}

  @Post()
  @UseGuards(AutenticacaoGuard)
  public async criaVeiculo(@Body() dadosDoVeiculo: CriaVeiculoDTO) {
    const veiculoCriado = await this.veiculoService.criaVeiculo(dadosDoVeiculo);

    return {
      veiculo: veiculoCriado,
      mensagem: 'Veículo criado com sucesso'
    }
  }

  @Get()
  public async listaVeiculo(
    @Query('marca') idMarca?: string,
    @Query('min') min?: number,
    @Query('max') max?: number
  ) {
    return !(idMarca || min || max)
      ? await this.veiculoService.listaVeiculo()
      : await this.veiculoService.listaPorFiltro(idMarca, min, max);
  }

  @Get()
  public async listaPorFiltro(
    @Query('marca') idMarca?: string,
    @Query('min') min?: number,
    @Query('max') max?: number
  ) {
    return await this.veiculoService.listaPorFiltro(idMarca, min, max);
  }

  @Put('/:id')
  @UseGuards(AutenticacaoGuard)
  public async atualizaVeiculo(
    @Param('id') id: string,
    @Body() novosDados: AtualizaVeiculoDTO
  ) {
    const veiculoAtualizado = await this.veiculoService.atualizaVeiculo(
      id,
      novosDados
    );

    return {
      veiculo: veiculoAtualizado,
      mensagem: 'Veículo atualizado com sucesso'
    }
  }

  @Delete('/:id')
  @UseGuards(AutenticacaoGuard)
  public async removeVeiculo(
    @Param('id') id: string
  ) {
    const veiculoRemovido = await this.veiculoService.removeVeiculo(id);

    return {
      veiculo: veiculoRemovido,
      mensagem: 'Veículo removido com sucesso'
    }
  }

  catch(excecao: unknown) {
    console.error(excecao);
  }
}