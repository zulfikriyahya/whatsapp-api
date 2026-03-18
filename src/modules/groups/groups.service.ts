import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { SessionManagerService } from "../sessions/session-manager.service";
import { ErrorCodes } from "../../common/constants/error-codes.constant";

@Injectable()
export class GroupsService {
  constructor(private manager: SessionManagerService) {}

  private client(sessionId: string) {
    const c = this.manager.getClient(sessionId);
    if (!c)
      throw new BadRequestException({ code: ErrorCodes.SESSION_NOT_CONNECTED });
    return c;
  }

  async create(sessionId: string, name: string, participants: string[]) {
    return this.client(sessionId).createGroup(name, participants);
  }

  async getInfo(sessionId: string, groupId: string) {
    return this.client(sessionId).getChatById(groupId);
  }

  async addParticipants(
    sessionId: string,
    groupId: string,
    participants: string[],
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.addParticipants(participants);
  }

  async removeParticipants(
    sessionId: string,
    groupId: string,
    participants: string[],
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.removeParticipants(participants);
  }

  async promoteParticipants(
    sessionId: string,
    groupId: string,
    participants: string[],
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.promoteParticipants(participants);
  }

  async demoteParticipants(
    sessionId: string,
    groupId: string,
    participants: string[],
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.demoteParticipants(participants);
  }

  async updateSubject(sessionId: string, groupId: string, subject: string) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.setSubject(subject);
  }

  async updateDescription(
    sessionId: string,
    groupId: string,
    description: string,
  ) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.setDescription(description);
  }

  async leave(sessionId: string, groupId: string) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.leave();
  }

  async getInviteCode(sessionId: string, groupId: string) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    const code = await group.getInviteCode();
    return { inviteLink: `https://chat.whatsapp.com/${code}` };
  }

  async revokeInvite(sessionId: string, groupId: string) {
    const group = (await this.client(sessionId).getChatById(groupId)) as any;
    return group.revokeInvite();
  }

  async joinViaInvite(sessionId: string, inviteCode: string) {
    return this.client(sessionId).acceptInvite(inviteCode);
  }

  async getInviteInfo(sessionId: string, inviteCode: string) {
    return this.client(sessionId).getInviteInfo(inviteCode);
  }
}
