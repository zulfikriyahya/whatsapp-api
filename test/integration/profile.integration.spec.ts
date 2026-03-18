import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Profile (integration)', () => {
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

  it('GET /api/v1/profile/s1 returns 401 without auth', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/profile/s1');
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/profile/s1/display-name returns 401 without auth', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/profile/s1/display-name')
      .send({ name: 'Bot' });
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/profile/s1/contacts/628123/block returns 401 without auth', async () => {
    const res = await request(app.getHttpServer()).post(
      '/api/v1/profile/s1/contacts/628123/block',
    );
    expect(res.status).toBe(401);
  });
});
