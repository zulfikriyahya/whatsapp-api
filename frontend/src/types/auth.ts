export interface LoginResponse {
  requiresTwoFactor: boolean
  tempToken?: string
}

export interface TwoFactorVerifyPayload {
  tempToken: string
  code: string
}

export interface TwoFactorSetupResponse {
  qrCode: string
  secret: string
}

export interface TwoFactorEnablePayload {
  code: string
}

export interface TwoFactorEnableResponse {
  backupCodes: string[]
}

export interface TwoFactorDisablePayload {
  code: string
}

export interface BackupCodesRegeneratePayload {
  code: string
}

export interface BackupCodesRegenerateResponse {
  backupCodes: string[]
}
