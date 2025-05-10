export class ListaUsuarioDTO {
  constructor(
      readonly id: string,
      readonly nome: string,
      public readonly email: string
  ) {}
}