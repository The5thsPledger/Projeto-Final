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
import { v4 as uuidv4 } from 'uuid';
import { VeiculoEntity } from 'backend/src/modulos/veiculo/veiculo.entity';

let app: INestApplication<any>;
let server: App;
let token: any;

const mockVeiculoRepository = {
  find: jest.fn().mockImplementation(async () => {
    return [
      {
        id: uuidv4(),
        nome: 'Veiculo Teste',
        descricao: 'Descricao Teste'
      },
      {
        id: uuidv4(),
        nome: 'Veiculo Teste 2',
        descricao: 'Descricao Teste 2'
      }
    ];
  }),
  findOne: jest.fn().mockImplementation(async () => {
    return {
      id: uuidv4(),
      nome: 'Veiculo Teste',
      descricao: 'Descricao Teste'
    };
  }),
  save: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({}),
};

describe('VeiculoController (e2e)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).overrideProvider(
        getRepositoryToken(UsuarioEntity)
      ).useValue(mockUsuarioRepoditory)
      .overrideProvider(
        getRepositoryToken(VeiculoEntity)
      ).useValue(mockVeiculoRepository)
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
    await app.listen(3004);

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

  test('POST /api/veiculos', async () => {
    await request(server).post('/api/veiculos').set('Authorization', `Bearer ${token}`)
      .send({
        modelo: 'Veiculo Teste',
        ano: 2025,
        valor: 10000,
        marca: 'Marca Teste',
      })
      .expect(201);
  });

  test('GET /api/veiculos', async () => {
    await request(server).get('/api/veiculos').set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  test('PUT /api/veiculos/:id', async () => {
    const response = await request(server).get('/api/veiculos').set('Authorization', `Bearer ${token}`)
      .expect(200);
      const id = response.body[0].id;
    await request(server).put(`/api/veiculos/${id}`).set('Authorization', `Bearer ${token}`)
      .send({
        modelo: 'Veiculo Atualizado',
        ano: 2026,
        valor: 20000,
        marca: 'Marca Atualizada'
      })
      .expect(200);
  });

  test('DELETE /api/veiculos/:id', async () => {
    const response = await request(server).get('/api/veiculos').set('Authorization', `Bearer ${token}`)
      .expect(200);
    const id = response.body[0].id;
    await request(server).delete(`/api/veiculos/${id}`).set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});