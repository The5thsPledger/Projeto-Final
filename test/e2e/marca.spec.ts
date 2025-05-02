import {describe, test} from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import Bootstrap from 'backend/src/main';
import request from 'supertest';
import { App } from 'supertest/types';

describe('módulo marca', () => {
  let app: INestApplication;
  let server: App
  beforeAll(async () => {
      app = await Bootstrap();
      await app.init();
      server = app.getHttpServer()
  });

  afterAll(async () => {  
    await app.close();
    process.removeAllListeners();
  });

  test('GET /api/marcas', async () => {
    await request(server).get('/api/marcas').expect(200);
  });
});