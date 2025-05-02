import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Max } from 'class-validator';
import { CriaMarcaDTO } from '../../marca/dto/CriaMarca.dto';

export class MarcaVeiculoDTO extends PartialType(CriaMarcaDTO) {
  @IsUUID(4, { message: 'Marca não existe' })
  id: string;
}

export class CriaVeiculoDTO {
  @IsNotEmpty({ message: 'O modelo não pode ser vazio' })
  modelo: string;

  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'O ano precisa ser numérico sem casas decimais' }
  )
  @IsPositive({ message: 'O ano precisa ser positivo' })
  @Max(9999, { message: 'O ano não pode ter mais de 4 dígitos' } )
  ano: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor precisa ser numérico com até duas casas decimais' }
  )
  @IsPositive({ message: 'O valor precisa ser positivo' })
  valor: number;

  @IsNotEmpty({ message: 'A marca não pode ser vazia' })
  marca: MarcaVeiculoDTO;
}