export const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  incr: jest.fn(),
  expire: jest.fn(),
  exists: jest.fn(),
  keys: jest.fn(),
  getClient: jest.fn().mockReturnValue({
    ping: jest.fn().mockResolvedValue("PONG"),
    info: jest.fn().mockResolvedValue("used_memory:1024"),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    incr: jest.fn(),
    expire: jest.fn(),
  }),
};
