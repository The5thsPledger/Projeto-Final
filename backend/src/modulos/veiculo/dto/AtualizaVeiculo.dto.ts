import { PartialType } from '@nestjs/mapped-types';
import { CriaVeiculoDTO } from "./CriaVeiculo.dto";

export class AtualizaVeiculoDTO extends PartialType(CriaVeiculoDTO) {}
