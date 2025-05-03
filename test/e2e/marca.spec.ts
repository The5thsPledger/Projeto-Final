import {test} from '@jest/globals';
import request from 'supertest';
import { mockUsuarioRepoditory, senhaTeste } from '../../jest.setup';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'backend/src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioEntity } from 'backend/src/modulos/usuario/usuario.entity';
import { useContainer } from 'class-validator';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from 'backend/src/exception.filter';
import { App } from 'supertest/types';
import { MarcaEntity } from 'backend/src/modulos/marca/marca.entity';
import { v4 as uuidv4 } from 'uuid';

let app: INestApplication<any>;
let server: App;
let token: any;

const mockMarcaRepository = {
  find: jest.fn().mockImplementation(async () => {
    return [
      {
        id: uuidv4(),
        nome: 'Marca Teste',
        descricao: 'Descricao Teste'
      },
      {
        id: uuidv4(),
        nome: 'Marca Teste 2',
        descricao: 'Descricao Teste 2'
      }
    ];
  }),
  findOne: jest.fn().mockImplementation(async (id: string) => {
    return {
      id: uuidv4(),
      nome: 'Marca Teste',
      descricao: 'Descricao Teste'
    };
  }),
  save: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
};

describe('MarcaController (e2e)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).overrideProvider(
        getRepositoryToken(UsuarioEntity)
      ).useValue(mockUsuarioRepoditory)
      .overrideProvider(
        getRepositoryToken(MarcaEntity)
      ).useValue(mockMarcaRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new CustomExceptionFilter());
    app.enableCors();
    app.setGlobalPrefix('api');
    app.enableShutdownHooks();
    app.use(
      (
        req: { method: string; }, 
        res: { setHeader: (arg0: string, arg1: string) => void; sendStatus: (arg0: number) => any; }, 
        next: () => void
      ) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') {
          return res.sendStatus(200);
        }
        next();
      }
    );
    app.useLogger(['log', 'error', 'warn', 'debug']);
    await app.listen(3002);

    server = app.getHttpServer()
  });

  afterAll(async () => {
    await app.close();
    process.removeAllListeners();
  });

  test('Login', async () => {
      const response = await request(server)
        .post('/api/autenticacao/login')
        .send({
          email: 'jest@test.com',
          senha: senhaTeste
        })
        .expect(201);
      expect(response.body).toHaveProperty('tokenAcesso');
      expect(response.body.tokenAcesso).toBeDefined();
      token = response.body.tokenAcesso;
  }, 100000);

  test('POST /api/marcas', async () => {
    await request(server).post('/api/marcas').set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Marca Teste',
      })
      .expect(201);
  });

  test('GET /api/marcas', async () => {
    await request(server).get('/api/marcas').set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  test('PUT /api/marcas/:id', async () => {
    const response = await request(server).get('/api/marcas').set('Authorization', `Bearer ${token}`)
      .expect(200);
      const id = response.body[0].id;
    await request(server).put(`/api/marcas/${id}`).set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Marca Teste Atualizada',
      })
      .expect(200);
  });

  test('DELETE /api/marcas/:id', async () => {
    const response = await request(server).get('/api/marcas').set('Authorization', `Bearer ${token}`)
      .expect(200);
    const id = response.body[0].id;
    await request(server).delete(`/api/marcas/${id}`).set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});