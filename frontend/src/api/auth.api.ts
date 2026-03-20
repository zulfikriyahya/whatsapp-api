import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'
import type { AuthUser } from '@/store/auth.store'
import type {
  TwoFactorVerifyPayload,
  TwoFactorSetupResponse,
  TwoFactorEnablePayload,
  TwoFactorEnableResponse,
  TwoFactorDisablePayload,
  BackupCodesRegeneratePayload,
  BackupCodesRegenerateResponse,
} from '@/types/auth'

export const authApi = {
  me: () =>
    api.get<ApiResponse<AuthUser>>('/auth/me').then((r) => r.data.data!),

  logout: () => api.post<ApiResponse>('/auth/logout').then((r) => r.data),

  verify2fa: (payload: TwoFactorVerifyPayload) =>
    api.post<ApiResponse>('/auth/2fa/verify', payload).then((r) => r.data),

  setup2fa: () =>
    api
      .post<ApiResponse<TwoFactorSetupResponse>>('/auth/2fa/setup')
      .then((r) => r.data.data!),

  enable2fa: (payload: TwoFactorEnablePayload) =>
    api
      .post<ApiResponse<TwoFactorEnableResponse>>('/auth/2fa/enable', payload)
      .then((r) => r.data.data!),

  disable2fa: (payload: TwoFactorDisablePayload) =>
    api.post<ApiResponse>('/auth/2fa/disable', payload).then((r) => r.data),

  regenerateBackupCodes: (payload: BackupCodesRegeneratePayload) =>
    api
      .post<
        ApiResponse<BackupCodesRegenerateResponse>
      >('/auth/2fa/backup-codes/regenerate', payload)
      .then((r) => r.data.data!),
}
