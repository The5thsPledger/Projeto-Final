import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MarcaVeiculoDTO {
  @IsUUID(4, { message: 'Marca não existe ou formato inválido' })
  id: string;
}

export class CriaVeiculoDTO {
  @IsNotEmpty({ message: 'O modelo não pode ser vazio' })
  modelo: string;

  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'O ano precisa ser um número inteiro' })
  @IsPositive({ message: 'O ano deve ser positivo' })
  @Max(9999, { message: 'O ano não pode ter mais que 4 dígitos' })
  ano: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
  @IsPositive({ message: 'O valor deve ser positivo' })
  valor: number;

  @IsNotEmpty({ message: 'A marca é obrigatória' })
  @ValidateNested()
  @Type(() => MarcaVeiculoDTO)
  marca: MarcaVeiculoDTO;
}
