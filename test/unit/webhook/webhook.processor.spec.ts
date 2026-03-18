import { Test, TestingModule } from '@nestjs/testing';
import { WebhookProcessor } from '../../../src/modules/webhook/processors/webhook.processor';
import { mockPrismaService } from '../../mocks/prisma.mock';
import { PrismaService } from '../../../src/prisma/prisma.service';

jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WebhookProcessor', () => {
  let processor: WebhookProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookProcessor,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    processor = module.get<WebhookProcessor>(WebhookProcessor);
    jest.clearAllMocks();
  });

  const makeJob = (overrides = {}) =>
    ({
      data: {
        userId: 'u1',
        url: 'https://example.com/webhook',
        payload: JSON.stringify({ event: 'new_message', text: 'Hello' }),
        headers: { 'Content-Type': 'application/json' },
      },
      attemptsMade: 0,
      ...overrides,
    }) as any;

  it('sends POST to webhook URL successfully', async () => {
    mockedAxios.post = jest.fn().mockResolvedValue({ status: 200 });
    await expect(processor.process(makeJob())).resolves.not.toThrow();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://example.com/webhook',
      { event: 'new_message', text: 'Hello' },
      expect.objectContaining({ timeout: 10000 }),
    );
  });

  it('throws with delay on failure to trigger retry', async () => {
    mockedAxios.post = jest
      .fn()
      .mockRejectedValue(new Error('Connection refused'));
    await expect(processor.process(makeJob())).rejects.toThrow(
      'Connection refused',
    );
  });

  it('increases retry delay exponentially based on attempt', async () => {
    mockedAxios.post = jest.fn().mockRejectedValue(new Error('Timeout'));
    try {
      await processor.process(makeJob({ attemptsMade: 2 }));
    } catch (e) {
      expect(e.delay).toBe(900 * 1000);
    }
  });

  it('uses last retry delay when attempts exceed max', async () => {
    mockedAxios.post = jest.fn().mockRejectedValue(new Error('Timeout'));
    try {
      await processor.process(makeJob({ attemptsMade: 99 }));
    } catch (e) {
      expect(e.delay).toBe(21600 * 1000);
    }
  });
});
