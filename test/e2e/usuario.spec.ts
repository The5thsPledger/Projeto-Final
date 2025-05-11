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

let app: INestApplication<any>;
let server: App;
let token: any;

describe('UsuarioController (e2e)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).overrideProvider(
        getRepositoryToken(UsuarioEntity)
      ).useValue(mockUsuarioRepoditory)
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
    await app.listen(3003);

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
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.access_token).toBeDefined();
      token = response.body.access_token;
  }, 100000);

  test('POST /api/usuarios', async () => {
    const response = await request(server).post('/api/usuarios').set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Usuario Teste',
        email: 'post@jest.com',
        senha: 'senha@Teste123',
      })
      .expect(201);
  });

  test('GET /api/usuarios', async () => {
    await request(server).get('/api/usuarios').set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  test('PUT /api/usuarios/:id', async () => {
    const response = await request(server).get('/api/usuarios').set('Authorization', `Bearer ${token}`)
      .expect(200);
      const id = response.body[0].id;
    await request(server).put(`/api/usuarios/${id}`).set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Usuario Teste Atualizada',
      })
      .expect(200);
  });

  test('DELETE /api/usuarios/:id', async () => {
    const response = await request(server).get('/api/usuarios').set('Authorization', `Bearer ${token}`)
      .expect(200);
    const id = response.body[0].id;
    await request(server).delete(`/api/usuarios/${id}`).set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});