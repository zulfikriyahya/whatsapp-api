import type { AxiosError } from 'axios'
import { getErrorMessage } from '@/constants/error-codes'

export function parseApiError(error: unknown): string {
  const axiosErr = error as AxiosError<{ error?: string; code?: string; message?: string }>
  const data = axiosErr.response?.data
  if (data?.code) return getErrorMessage(data.code, data.error)
  if (data?.error) return data.error
  if (data?.message) return data.message
  return axiosErr.message ?? 'Terjadi kesalahan'
}
