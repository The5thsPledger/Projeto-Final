import { IsNotEmpty } from 'class-validator';

export class CriaMarcaDTO {
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  nome: string;
}
