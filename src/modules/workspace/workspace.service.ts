import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '@prisma/client';
import { ErrorCodes } from '../../common/constants/error-codes.constant';
import { UpdateMemberPermissionDto } from './dto/update-member-permission.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async create(
    userId: string,
    email: string,
    name: string,
    ip: string,
    ua: string,
  ) {
    const ws = await this.prisma.workspace.create({
      data: {
        name,
        ownerId: userId,
        members: { create: { userId, role: 'owner' } },
      },
      include: { members: true },
    });
    await this.audit.log({
      userId,
      userEmail: email,
      action: AuditAction.CREATE_WORKSPACE,
      details: { workspaceId: ws.id },
      ip,
      userAgent: ua,
    });
    return ws;
  }

  async findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  }

  async invite(
    ownerId: string,
    ownerEmail: string,
    workspaceId: string,
    email: string,
    ip: string,
    ua: string,
  ) {
    const ws = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, ownerId },
    });
    if (!ws) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    const member = await this.prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId, userId: user.id } },
      create: { workspaceId, userId: user.id, role: 'member' },
      update: {},
    });
    await this.audit.log({
      userId: ownerId,
      userEmail: ownerEmail,
      action: AuditAction.INVITE_MEMBER,
      details: { workspaceId, email },
      ip,
      userAgent: ua,
    });
    return member;
  }

  async updateMemberPermission(
    ownerId: string,
    workspaceId: string,
    memberId: string,
    dto: UpdateMemberPermissionDto,
  ) {
    const ws = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, ownerId },
    });
    if (!ws) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    if (memberId === ownerId)
      throw new ForbiddenException({ code: ErrorCodes.FORBIDDEN });
    return this.prisma.workspaceMember.updateMany({
      where: { workspaceId, userId: memberId },
      data: {
        ...(dto.role ? { role: dto.role } : {}),
        ...(dto.permissions ? { permissions: dto.permissions } : {}),
      },
    });
  }

  async removeMember(
    ownerId: string,
    ownerEmail: string,
    workspaceId: string,
    memberId: string,
    ip: string,
    ua: string,
  ) {
    const ws = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, ownerId },
    });
    if (!ws) throw new NotFoundException({ code: ErrorCodes.NOT_FOUND });
    if (memberId === ownerId)
      throw new ForbiddenException({ code: ErrorCodes.CANNOT_DELETE_SELF });
    await this.prisma.workspaceMember.deleteMany({
      where: { workspaceId, userId: memberId },
    });
    await this.audit.log({
      userId: ownerId,
      userEmail: ownerEmail,
      action: AuditAction.REMOVE_MEMBER,
      details: { workspaceId, memberId },
      ip,
      userAgent: ua,
    });
  }
}
