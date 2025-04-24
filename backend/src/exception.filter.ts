import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  GatewayTimeoutException,
  HttpException,
  RequestTimeoutException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    let msg: string;
    if (
      exception instanceof HttpException ||
      exception instanceof GatewayTimeoutException ||
      exception instanceof RequestTimeoutException
    ) {
      let exceptionResponse: any;
      let detalhe = "";
      if (exception instanceof HttpException) {
        exceptionResponse = exception.getResponse();
        detalhe = Array.isArray(exceptionResponse?.message)
          ? exceptionResponse.message.join(', ')
          : exceptionResponse.message;
        detalhe = detalhe == exception.message ? "" : detalhe;
      }
      const status = exception.getStatus();
      response.status(status).json({
        status: status,
        mensagem: exception.message,
        detalhe: detalhe,
        timeStamp: new Date(),
        path: request.url,
        method: request.method,
        body: request.body,
      });
    } 
    else if (exception instanceof QueryFailedError) {
      const code = exception.driverError.code;
      let status = 500;
      switch (code) {
        case 'ER_ACCESS_DENIED_ERROR':
          status = 412;
          msg = 'Acesso ao banco de dados negado.';
          break;
        case 'ER_BAD_DB_ERROR':
          status = 412;
          msg = 'O bnco de dados não foi reconhecido.';
          break;
        case 'ER_PARSE_ERROR':
          status = 412;
          msg = 'Houve um erro sintático no SQL.';
          break;
        case 'ER_DUP_ENTRY':
          status = 412;
          msg = 'Houve uma tentativa inválida de duplicar dados.';
          break;
        case 'ER_NO_SUCH_TABLE':
          status = 412;
          msg = 'A tabela solicitada do banco de dados não existe.';
          break;
        case 'ECONNABORTED':
          status = 412;
          msg = 'Conexão com o banco de dados abortada.';
          break;
        case '23502':
          status = 412;
          msg = 'Houve uma tentativa de inserir um valor nulo em uma coluna que não aceita valores nulos.';
          break;
        case '23503':
          status = 412;
          msg = 'Houve uma tentativa de inserir um valor que viola uma restrição de chave estrangeira.';
          break;
        case '23505':
          status = 412;
          msg = 'Houve uma tentativa de inserir um valor que viola uma restrição de chave única.';
          break;
        case '23514':
          status = 412;
          msg = 'Houve uma tentativa de inserir um valor que viola uma restrição de verificação.';
          break;
        default:
          msg = exception.message;
      }
      response.status(status).json({
        status: status,
        mensagem: msg,
        timeStamp: new Date(),
        path: request.url,
        method: request.method,
        body: request.body,
      });
    } 
    else {
      const code = exception.code;
      let status = 500;
      switch (code) {
        case 'ECONNREFUSED':
          status = 503;
          msg = 'Houve um erro ao se conectar com o banco de dados.';
          break;
        case 'ETIMEDOUT':
          status = 408;
          msg = 'O tempo limite foi estourado.';
          break;
        case 'EHOSTUNREACH':
          status = 503;
          msg = 'O servidor de banco de dados está inacessível';
          break;
        case 'ENETUNREACH':
          status = 503;
          msg = 'A rede está inacessível.';
          break;
        case 'ECONNRESET':
          msg = 'A conexão foi resetada';
          break;
        default:
          msg = exception.message;
          console.log(exception);
      }
      response.status(status).json({
        status: status,
        mensagem: msg,
        timeStamp: new Date(),
        path: request.url,
        method: request.method,
        body: request.body,
      });
    }
  }
}
