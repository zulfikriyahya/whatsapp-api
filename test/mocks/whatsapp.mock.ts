export const mockWhatsappClient = {
  initialize: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn().mockResolvedValue(undefined),
  sendMessage: jest
    .fn()
    .mockResolvedValue({ id: { _serialized: "mock-msg-id" } }),
  sendPresenceAvailable: jest.fn().mockResolvedValue(undefined),
  sendPresenceUnavailable: jest.fn().mockResolvedValue(undefined),
  getState: jest.fn().mockResolvedValue("CONNECTED"),
  getWWebVersion: jest.fn().mockResolvedValue("2.2000.0"),
  isRegisteredUser: jest.fn().mockResolvedValue(true),
  getChats: jest.fn().mockResolvedValue([]),
  getChatById: jest
    .fn()
    .mockResolvedValue({ id: { _serialized: "mock-chat" } }),
  getMessageById: jest
    .fn()
    .mockResolvedValue({ delete: jest.fn(), react: jest.fn() }),
  searchMessages: jest.fn().mockResolvedValue([]),
  createGroup: jest
    .fn()
    .mockResolvedValue({ gid: { _serialized: "mock-group@g.us" } }),
  acceptInvite: jest.fn().mockResolvedValue(undefined),
  getInviteInfo: jest.fn().mockResolvedValue({}),
  requestPairingCode: jest.fn().mockResolvedValue("123-456"),
  info: { wid: { user: "628123456789" } },
  on: jest.fn(),
};

export const mockSessionManagerService = {
  getClient: jest.fn().mockReturnValue(mockWhatsappClient),
  sendMessage: jest
    .fn()
    .mockResolvedValue({ id: { _serialized: "mock-msg-id" } }),
  sendMedia: jest
    .fn()
    .mockResolvedValue({ id: { _serialized: "mock-msg-id" } }),
  getHealthySession: jest.fn().mockResolvedValue("mock-session-id"),
  initClient: jest.fn().mockResolvedValue(undefined),
  getConnectedSessions: jest.fn().mockReturnValue(["mock-session-id"]),
};
