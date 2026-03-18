import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Messages (integration)', () => {
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

  it('POST /api/v1/messages/send returns 401 without auth', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/messages/send')
      .send({ to: '08123456789', message: 'Hello' });
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/messages/send-contact returns 401 without auth', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/messages/send-contact')
      .send({ to: '08123456789', contacts: ['08111111111'] });
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/messages/logs returns 401 without auth', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/messages/logs');
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/messages/s1/messages/msg1/forward returns 401 without auth', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/messages/s1/messages/msg1/forward')
      .send({ to: '08123456789' });
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/messages/s1/messages/msg1/pin returns 401 without auth', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/messages/s1/messages/msg1/pin')
      .send({});
    expect(res.status).toBe(401);
  });
});
