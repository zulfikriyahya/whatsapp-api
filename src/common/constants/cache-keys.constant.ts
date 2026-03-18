export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  userQuota: (id: string) => `quota:${id}`,
  apiKey: (hash: string) => `apikey:${hash}`,
  twoFaTempToken: (token: string) => `2fa:temp:${token}`,
  workflowsActive: (userId: string) => `workflows:${userId}:active`,
  templatesUser: (userId: string) => `templates:${userId}`,
  roundRobin: (userId: string) => `rr:${userId}`,
  sessionStatus: (sessionId: string) => `session:status:${sessionId}`,
} as const;
