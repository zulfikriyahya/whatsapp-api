import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Auth (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: 1 as any, defaultVersion: '1' });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns ok', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/v1/auth/me returns 401 without auth', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/auth/2fa/verify returns 401 with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/2fa/verify')
      .send({ tempToken: 'invalid-token', code: '123456' });
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/auth/2fa/verify returns 400 with missing fields', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/2fa/verify')
      .send({});
    expect(res.status).toBe(400);
  });

  it('POST /api/v1/auth/logout returns 401 without auth', async () => {
    const res = await request(app.getHttpServer()).post('/api/v1/auth/logout');
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/auth/2fa/backup-codes/regenerate returns 401 without auth', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/2fa/backup-codes/regenerate')
      .send({ code: '123456' });
    expect(res.status).toBe(401);
  });
});
