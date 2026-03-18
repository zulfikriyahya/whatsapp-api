import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppModule (e2e)', () => {
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
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('GET unknown route returns 404', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/unknown-route');
    expect(res.status).toBe(404);
  });

  it('protected routes return 401 without auth', async () => {
    const routes = [
      { method: 'get', path: '/api/v1/sessions' },
      { method: 'get', path: '/api/v1/messages/logs' },
      { method: 'get', path: '/api/v1/contacts' },
      { method: 'get', path: '/api/v1/broadcast/campaigns' },
      { method: 'get', path: '/api/v1/auto-reply' },
      { method: 'get', path: '/api/v1/workflows' },
      { method: 'get', path: '/api/v1/drip-campaigns' },
      { method: 'get', path: '/api/v1/scheduler' },
      { method: 'get', path: '/api/v1/templates' },
      { method: 'get', path: '/api/v1/keys' },
      { method: 'get', path: '/api/v1/settings/me' },
      { method: 'get', path: '/api/v1/inbox' },
      { method: 'get', path: '/api/v1/analytics/dashboard' },
      { method: 'get', path: '/api/v1/profile/s1' },
      { method: 'get', path: '/api/v1/workspaces' },
      { method: 'get', path: '/api/v1/tiers' },
      { method: 'get', path: '/api/v1/calls' },
      { method: 'get', path: '/api/v1/audit' },
    ];

    for (const route of routes) {
      const res = await (request(app.getHttpServer()) as any)[route.method](
        route.path,
      );
      expect(res.status).toBe(401);
    }
  });

  it('POST endpoints return 401 without auth', async () => {
    const routes = [
      {
        path: '/api/v1/messages/send',
        body: { to: '08123456789', message: 'Hi' },
      },
      { path: '/api/v1/sessions', body: { name: 'test' } },
      { path: '/api/v1/broadcast', body: { name: 'T', message: 'H' } },
      {
        path: '/api/v1/auto-reply',
        body: { keyword: 'hi', response: 'hello', matchType: 'exact' },
      },
      {
        path: '/api/v1/workflows',
        body: { name: 'W', triggerCondition: {}, nodes: [] },
      },
      { path: '/api/v1/settings/maintenance', body: { enabled: true } },
      { path: '/api/v1/settings/announcement', body: { message: 'Test' } },
    ];

    for (const route of routes) {
      const res = await request(app.getHttpServer())
        .post(route.path)
        .send(route.body);
      expect(res.status).toBe(401);
    }
  });

  it('validation returns 400 on invalid body', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/2fa/verify')
      .send({ tempToken: 123, code: 'toolong123456' });
    expect(res.status).toBe(400);
  });
});
