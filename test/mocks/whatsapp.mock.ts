export const mockWhatsappClient = {
  initialize: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn().mockResolvedValue(undefined),
  sendMessage: jest
    .fn()
    .mockResolvedValue({ id: { _serialized: 'mock-msg-id' } }),
  sendPresenceAvailable: jest.fn().mockResolvedValue(undefined),
  sendPresenceUnavailable: jest.fn().mockResolvedValue(undefined),
  getState: jest.fn().mockResolvedValue('CONNECTED'),
  getWWebVersion: jest.fn().mockResolvedValue('2.2000.0'),
  isRegisteredUser: jest.fn().mockResolvedValue(true),
  getChats: jest.fn().mockResolvedValue([]),
  getChatById: jest.fn().mockResolvedValue({
    id: { _serialized: 'mock-chat' },
    archive: jest.fn().mockResolvedValue(undefined),
    unarchive: jest.fn().mockResolvedValue(undefined),
    mute: jest.fn().mockResolvedValue(undefined),
    unmute: jest.fn().mockResolvedValue(undefined),
    pin: jest.fn().mockResolvedValue(undefined),
    unpin: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
    sendSeen: jest.fn().mockResolvedValue(undefined),
    addParticipants: jest.fn().mockResolvedValue(undefined),
    removeParticipants: jest.fn().mockResolvedValue(undefined),
    promoteParticipants: jest.fn().mockResolvedValue(undefined),
    demoteParticipants: jest.fn().mockResolvedValue(undefined),
    setSubject: jest.fn().mockResolvedValue(undefined),
    setDescription: jest.fn().mockResolvedValue(undefined),
    leave: jest.fn().mockResolvedValue(undefined),
    getInviteCode: jest.fn().mockResolvedValue('abc123'),
    revokeInvite: jest.fn().mockResolvedValue(undefined),
    approveGroupMembershipRequests: jest.fn().mockResolvedValue(undefined),
    rejectGroupMembershipRequests: jest.fn().mockResolvedValue(undefined),
    getGroupMembershipRequests: jest.fn().mockResolvedValue([]),
  }),
  getMessageById: jest.fn().mockResolvedValue({
    id: { _serialized: 'mock-msg-id' },
    hasMedia: true,
    delete: jest.fn().mockResolvedValue(undefined),
    react: jest.fn().mockResolvedValue(undefined),
    edit: jest.fn().mockResolvedValue({ id: { _serialized: 'mock-msg-id' } }),
    forward: jest.fn().mockResolvedValue(undefined),
    pin: jest.fn().mockResolvedValue(undefined),
    unpin: jest.fn().mockResolvedValue(undefined),
    star: jest.fn().mockResolvedValue(undefined),
    downloadMedia: jest.fn().mockResolvedValue({
      mimetype: 'image/jpeg',
      data: Buffer.from('fake').toString('base64'),
      filename: 'test.jpg',
    }),
  }),
  searchMessages: jest.fn().mockResolvedValue([]),
  createGroup: jest
    .fn()
    .mockResolvedValue({ gid: { _serialized: 'mock-group@g.us' } }),
  acceptInvite: jest.fn().mockResolvedValue(undefined),
  getInviteInfo: jest.fn().mockResolvedValue({}),
  requestPairingCode: jest.fn().mockResolvedValue('123-456'),
  getContacts: jest.fn().mockResolvedValue([]),
  getContactById: jest.fn().mockResolvedValue({
    id: { _serialized: '628123@s.whatsapp.net' },
    block: jest.fn().mockResolvedValue(undefined),
    unblock: jest.fn().mockResolvedValue(undefined),
  }),
  getProfilePicUrl: jest.fn().mockResolvedValue('https://example.com/pic.jpg'),
  setStatus: jest.fn().mockResolvedValue(undefined),
  setDisplayName: jest.fn().mockResolvedValue(undefined),
  setProfilePicture: jest.fn().mockResolvedValue(undefined),
  deleteProfilePicture: jest.fn().mockResolvedValue(undefined),
  getBlockedContacts: jest.fn().mockResolvedValue([]),
  getLabels: jest.fn().mockResolvedValue([]),
  getLabelById: jest.fn().mockResolvedValue({ id: 'label-1', name: 'VIP' }),
  addOrRemoveLabels: jest.fn().mockResolvedValue(undefined),
  getChatsByLabel: jest.fn().mockResolvedValue([]),
  info: {
    wid: { user: '628123456789' },
    pushname: 'Test Bot',
    platform: 'android',
  },
  on: jest.fn(),
};

export const mockSessionManagerService = {
  getClient: jest.fn().mockReturnValue(mockWhatsappClient),
  sendMessage: jest
    .fn()
    .mockResolvedValue({ id: { _serialized: 'mock-msg-id' } }),
  sendMedia: jest
    .fn()
    .mockResolvedValue({ id: { _serialized: 'mock-msg-id' } }),
  getHealthySession: jest.fn().mockResolvedValue('mock-session-id'),
  initClient: jest.fn().mockResolvedValue(undefined),
  getConnectedSessions: jest.fn().mockReturnValue(['mock-session-id']),
};
