import { PartialType } from '@nestjs/mapped-types';
import { CriaMarcaDTO } from "./CriaMarca.dto";

export class AtualizaMarcaDTO extends PartialType(CriaMarcaDTO) {}
