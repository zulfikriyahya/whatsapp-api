import api from '@/lib/axios'
import type { ApiResponse } from '@/types/api'

export type ParticipantRole = 'admin' | 'member'

export interface GroupParticipant {
  id: string
  phoneNumber: string
  name?: string
  role: ParticipantRole
}

export interface GroupInfo {
  id: string
  name: string
  description?: string
  participantCount: number
  participants: GroupParticipant[]
  inviteLink?: string
  isAdmin: boolean
  createdAt?: string
}

export interface MembershipRequest {
  id: string
  phoneNumber: string
  name?: string
  requestedAt: string
}

export const groupsApi = {
  getInfo: (sessionId: string, groupId: string) =>
    api
      .get<ApiResponse<GroupInfo>>(`/groups/${sessionId}/${groupId}`)
      .then((r) => r.data.data!),

  updateInfo: (
    sessionId: string,
    groupId: string,
    payload: { name?: string; description?: string }
  ) =>
    api
      .post<
        ApiResponse<GroupInfo>
      >(`/groups/${sessionId}/${groupId}/update`, payload)
      .then((r) => r.data.data!),

  getInviteLink: (sessionId: string, groupId: string) =>
    api
      .get<
        ApiResponse<{ inviteLink: string }>
      >(`/groups/${sessionId}/${groupId}/invite`)
      .then((r) => r.data.data!),

  revokeInviteLink: (sessionId: string, groupId: string) =>
    api
      .post<
        ApiResponse<{ inviteLink: string }>
      >(`/groups/${sessionId}/${groupId}/invite/revoke`)
      .then((r) => r.data.data!),

  joinViaCode: (sessionId: string, inviteCode: string) =>
    api
      .post<ApiResponse>(`/groups/${sessionId}/join`, { inviteCode })
      .then((r) => r.data),

  addParticipants: (
    sessionId: string,
    groupId: string,
    participants: string[]
  ) =>
    api
      .post<ApiResponse>(`/groups/${sessionId}/${groupId}/participants/add`, {
        participants,
      })
      .then((r) => r.data),

  removeParticipants: (
    sessionId: string,
    groupId: string,
    participants: string[]
  ) =>
    api
      .post<ApiResponse>(
        `/groups/${sessionId}/${groupId}/participants/remove`,
        { participants }
      )
      .then((r) => r.data),

  promoteParticipant: (
    sessionId: string,
    groupId: string,
    participant: string
  ) =>
    api
      .post<ApiResponse>(
        `/groups/${sessionId}/${groupId}/participants/promote`,
        { participant }
      )
      .then((r) => r.data),

  demoteParticipant: (
    sessionId: string,
    groupId: string,
    participant: string
  ) =>
    api
      .post<ApiResponse>(
        `/groups/${sessionId}/${groupId}/participants/demote`,
        { participant }
      )
      .then((r) => r.data),

  getMembershipRequests: (sessionId: string, groupId: string) =>
    api
      .get<
        ApiResponse<MembershipRequest[]>
      >(`/groups/${sessionId}/${groupId}/membership-request`)
      .then((r) => r.data.data!),

  approveMembershipRequest: (
    sessionId: string,
    groupId: string,
    requestId: string
  ) =>
    api
      .post<ApiResponse>(`/groups/${sessionId}/${groupId}/membership-request`, {
        requestId,
        action: 'approve',
      })
      .then((r) => r.data),

  rejectMembershipRequest: (
    sessionId: string,
    groupId: string,
    requestId: string
  ) =>
    api
      .post<ApiResponse>(`/groups/${sessionId}/${groupId}/membership-request`, {
        requestId,
        action: 'reject',
      })
      .then((r) => r.data),

  leave: (sessionId: string, groupId: string) =>
    api
      .post<ApiResponse>(`/groups/${sessionId}/${groupId}/leave`)
      .then((r) => r.data),
}
