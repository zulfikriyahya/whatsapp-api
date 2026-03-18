/**
 * FIX: Tambah ALL_SESSIONS_DOWN yang dipakai di session-manager,
 * dan BROADCAST_COMPLETE yang sudah disebutkan di doc tapi belum ada di enum.
 */
export enum AlertType {
  QUOTA_WARNING = "quota_warning",
  QUOTA_EXCEEDED = "quota_exceeded",
  SESSION_DISCONNECTED = "session_disconnected",
  SESSION_LOGGED_OUT = "session_logged_out",
  ALL_SESSIONS_DOWN = "all_sessions_down", // FIX: sudah dipakai tapi belum ada
  AI_DISABLED = "ai_disabled",
  DISK_WARNING = "disk_warning",
  REDIS_DISCONNECTED = "redis_disconnected",
  BROADCAST_COMPLETE = "broadcast_complete", // FIX: disebutkan di doc section 30
}
